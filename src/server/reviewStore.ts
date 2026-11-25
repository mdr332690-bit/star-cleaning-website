import { randomUUID } from 'node:crypto'
import { getDatabase } from '@netlify/database'
import { and, desc, eq, gt, isNull, lte, or, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/netlify-db'
import {
  invitations,
  moderationEvents,
  reviewLimits,
  reviewPhotos,
  reviews,
} from '../../db/schema'
import {
  hash,
  makeInvite,
  ReviewError,
  type reviewInput,
} from './reviewValidation'

export type ReviewInput = ReturnType<typeof reviewInput>
export type Moderation = 'approve' | 'reject' | 'delete'
export type ReviewQueue = 'pending' | 'approved' | 'rejected'
export type ReviewMedia = {
  set: (key: string, value: Uint8Array<ArrayBuffer>) => Promise<unknown>
  get: (key: string) => Promise<ArrayBuffer | null>
  delete: (key: string) => Promise<unknown>
}

const createDatabase = () => drizzle({ client: getDatabase() })
export type ReviewDatabase = ReturnType<typeof createDatabase>
let connection: ReviewDatabase | undefined
export const reviewDatabase = () => (connection ??= createDatabase())
const approved = (scope: string) =>
  and(eq(reviews.scope, scope), eq(reviews.status, 'approved'))
const active = () =>
  and(
    isNull(invitations.revokedAt),
    isNull(invitations.redeemedAt),
    gt(invitations.expiresAt, sql`now()`),
  )
const reviewPublicFields = {
  id: reviews.id,
  name: reviews.name,
  rating: reviews.rating,
  experience: reviews.experience,
  language: reviews.language,
  submittedAt: reviews.submittedAt,
  hasPhoto: sql<boolean>`${reviews.photoId} is not null`,
}

export function createReviewStore(
  database: ReviewDatabase,
  scope: string,
  media: ReviewMedia,
) {
  async function cleanupPhoto(id: string) {
    await database.transaction(async (tx) => {
      const [staged] = await tx
        .select({ id: reviewPhotos.id })
        .from(reviewPhotos)
        .where(
          and(
            eq(reviewPhotos.id, id),
            eq(reviewPhotos.scope, scope),
            lte(reviewPhotos.cleanupAt, sql`now()`),
          ),
        )
        .for('update', { skipLocked: true })
      if (!staged) return
      await media.delete(id)
      await tx
        .delete(reviewPhotos)
        .where(and(eq(reviewPhotos.id, id), eq(reviewPhotos.scope, scope)))
    })
  }
  return {
    async list() {
      const rows = await database
        .select({
          ...reviewPublicFields,
          total: sql<number>`(count(*) over ())::int`,
          average: sql<number>`round(avg(${reviews.rating}) over (), 1)::float8`,
        })
        .from(reviews)
        .where(approved(scope))
        .orderBy(desc(reviews.submittedAt), desc(reviews.id))
        .limit(12)
      return {
        total: rows[0]?.total ?? 0,
        average: rows[0]?.average ?? null,
        reviews: rows.map(
          ({ total: _total, average: _average, ...review }) => review,
        ),
      }
    },
    async photo(reviewId: string, moderator = false) {
      const [review] = await database
        .select({ photoId: reviews.photoId })
        .from(reviews)
        .where(
          and(
            moderator
              ? and(
                  eq(reviews.scope, scope),
                  or(
                    eq(reviews.status, 'pending'),
                    eq(reviews.status, 'approved'),
                  ),
                )
              : approved(scope),
            eq(reviews.id, reviewId),
          ),
        )
        .limit(1)
      return review?.photoId ? media.get(review.photoId) : null
    },
    async throttle(subject: string, maximum: number) {
      const minute = Math.floor(Date.now() / 900_000)
      const [limit] = await database
        .insert(reviewLimits)
        .values({ scope, subject: hash(`${scope}:${subject}`), minute })
        .onConflictDoUpdate({
          target: [
            reviewLimits.scope,
            reviewLimits.subject,
            reviewLimits.minute,
          ],
          set: { attempts: sql`${reviewLimits.attempts} + 1` },
          setWhere: sql`${reviewLimits.attempts} < ${maximum}`,
        })
        .returning({ attempts: reviewLimits.attempts })
      if (!limit) throw new ReviewError('rate', 429)
    },
    async checkInvitation(tokenHash: string) {
      const [invite] = await database
        .select({ id: invitations.id })
        .from(invitations)
        .where(
          and(
            eq(invitations.scope, scope),
            eq(invitations.tokenHash, tokenHash),
            active(),
          ),
        )
        .limit(1)
      if (!invite) throw new ReviewError('invitation', 400)
    },
    async submit(input: ReviewInput, bytes: Uint8Array<ArrayBuffer> | null) {
      const photoId = bytes ? randomUUID() : null
      try {
        if (photoId && bytes) {
          await database
            .insert(reviewPhotos)
            .values({
              id: photoId,
              scope,
              cleanupAt: new Date(Date.now() + 60 * 60 * 1000),
            })
          await media.set(photoId, bytes)
        }
        await database.transaction(async (tx) => {
          const [invitation] = await tx
            .update(invitations)
            .set({ redeemedAt: sql`now()` })
            .where(
              and(
                eq(invitations.scope, scope),
                eq(invitations.tokenHash, input.tokenHash),
                active(),
              ),
            )
            .returning({ id: invitations.id })
          if (!invitation) throw new ReviewError('invitation', 400)
          if (photoId) {
            const [claimed] = await tx
              .update(reviewPhotos)
              .set({ cleanupAt: null })
              .where(
                and(
                  eq(reviewPhotos.scope, scope),
                  eq(reviewPhotos.id, photoId),
                  gt(reviewPhotos.cleanupAt, sql`now()`),
                ),
              )
              .returning({ id: reviewPhotos.id })
            if (!claimed) throw new ReviewError('photo', 400)
          }
          await tx
            .insert(reviews)
            .values({
              scope,
              invitationId: invitation.id,
              name: input.name,
              experience: input.experience,
              rating: input.rating,
              language: input.language,
              photoId,
            })
        })
      } catch (error) {
        if (photoId) {
          await database
            .update(reviewPhotos)
            .set({ cleanupAt: sql`now()` })
            .where(
              and(
                eq(reviewPhotos.scope, scope),
                eq(reviewPhotos.id, photoId),
                sql`${reviewPhotos.cleanupAt} is not null`,
              ),
            )
            .then(() => cleanupPhoto(photoId))
            .catch(() => undefined)
        }
        throw error
      }
    },
    async dashboard(status: ReviewQueue, page: number) {
      const pageSize = 25
      const [items, links, history] = await Promise.all([
        database
          .select({
            ...reviewPublicFields,
            status: reviews.status,
            job: invitations.job,
          })
          .from(reviews)
          .innerJoin(
            invitations,
            and(
              eq(invitations.id, reviews.invitationId),
              eq(invitations.scope, scope),
            ),
          )
          .where(and(eq(reviews.scope, scope), eq(reviews.status, status)))
          .orderBy(desc(reviews.submittedAt), desc(reviews.id))
          .offset(page * pageSize)
          .limit(pageSize + 1),
        database
          .select({
            id: invitations.id,
            job: invitations.job,
            expiresAt: invitations.expiresAt,
            revokedAt: invitations.revokedAt,
            redeemedAt: invitations.redeemedAt,
          })
          .from(invitations)
          .where(eq(invitations.scope, scope))
          .orderBy(desc(invitations.createdAt), desc(invitations.id))
          .offset(page * pageSize)
          .limit(pageSize + 1),
        database
          .select({
            id: moderationEvents.id,
            targetId: moderationEvents.targetId,
            actor: moderationEvents.actor,
            action: moderationEvents.action,
            reason: moderationEvents.reason,
            createdAt: moderationEvents.createdAt,
          })
          .from(moderationEvents)
          .where(eq(moderationEvents.scope, scope))
          .orderBy(desc(moderationEvents.createdAt), desc(moderationEvents.id))
          .offset(page * pageSize)
          .limit(pageSize + 1),
      ])
      return {
        items: items.slice(0, pageSize),
        links: links.slice(0, pageSize),
        history: history.slice(0, pageSize),
        hasMore:
          Math.max(items.length, links.length, history.length) > pageSize,
      }
    },
    async invite(job: string, days: number, actor: string) {
      const code = makeInvite()
      const expiresAt = new Date(Date.now() + days * 86_400_000)
      await database.transaction(async (tx) => {
        const [invitation] = await tx
          .insert(invitations)
          .values({ scope, job, tokenHash: hash(code), expiresAt })
          .onConflictDoUpdate({
            target: [invitations.scope, invitations.job],
            set: { tokenHash: hash(code), expiresAt, revokedAt: null },
            setWhere: and(
              isNull(invitations.redeemedAt),
              or(
                lte(invitations.expiresAt, sql`now()`),
                sql`${invitations.revokedAt} is not null`,
              ),
            ),
          })
          .returning({ id: invitations.id })
        if (!invitation) throw new ReviewError('jobConflict', 409)
        await tx
          .insert(moderationEvents)
          .values({ scope, targetId: invitation.id, actor, action: 'invite' })
      })
      return { code, expiresAt }
    },
    async changeInvitation(
      id: string,
      actor: string,
      reason: string,
      days?: number,
    ) {
      await database.transaction(async (tx) => {
        const [updated] = await tx
          .update(invitations)
          .set(
            days === undefined
              ? { revokedAt: sql`now()` }
              : { expiresAt: new Date(Date.now() + days * 86_400_000) },
          )
          .where(
            and(
              eq(invitations.scope, scope),
              eq(invitations.id, id),
              isNull(invitations.revokedAt),
              isNull(invitations.redeemedAt),
            ),
          )
          .returning({ id: invitations.id })
        if (!updated) throw new ReviewError('notFound', 404)
        await tx
          .insert(moderationEvents)
          .values({
            scope,
            targetId: id,
            actor,
            action: days === undefined ? 'revoke' : 'expiry',
            reason,
          })
      })
    },
    async moderate(
      id: string,
      action: Moderation,
      actor: string,
      reason: string | null,
    ) {
      const removedPhoto = await database.transaction(async (tx) => {
        const [review] = await tx
          .select({ status: reviews.status, photoId: reviews.photoId })
          .from(reviews)
          .where(and(eq(reviews.id, id), eq(reviews.scope, scope)))
          .for('update')
        if (!review || review.status === 'deleted')
          throw new ReviewError('notFound', 404)
        if (
          (action === 'approve' && review.status !== 'pending') ||
          (action === 'reject' && review.status === 'rejected')
        )
          throw new ReviewError('transition', 409)
        const status =
          action === 'approve'
            ? 'approved'
            : action === 'reject'
              ? 'rejected'
              : 'deleted'
        const removed = action === 'approve' ? null : review.photoId
        await tx
          .update(reviews)
          .set({
            status,
            moderatedAt: sql`now()`,
            ...(removed ? { photoId: null } : {}),
            ...(action === 'delete' ? { name: null, experience: null } : {}),
          })
          .where(and(eq(reviews.id, id), eq(reviews.scope, scope)))
        if (removed)
          await tx
            .update(reviewPhotos)
            .set({ cleanupAt: sql`now()` })
            .where(
              and(eq(reviewPhotos.id, removed), eq(reviewPhotos.scope, scope)),
            )
        await tx
          .insert(moderationEvents)
          .values({ scope, targetId: id, actor, action, reason })
        return removed
      })
      if (removedPhoto) await cleanupPhoto(removedPhoto).catch(() => undefined)
    },
    async cleanup() {
      const candidates = await database
        .select({ id: reviewPhotos.id })
        .from(reviewPhotos)
        .where(
          and(
            eq(reviewPhotos.scope, scope),
            lte(reviewPhotos.cleanupAt, sql`now()`),
          ),
        )
        .limit(50)
      for (const candidate of candidates) await cleanupPhoto(candidate.id)
      await database
        .update(reviews)
        .set({ name: null, experience: null })
        .where(
          and(
            eq(reviews.scope, scope),
            eq(reviews.status, 'rejected'),
            lte(reviews.moderatedAt, sql`now() - interval '30 days'`),
            sql`${reviews.name} is not null`,
          ),
        )
      await database
        .delete(reviewLimits)
        .where(
          and(
            eq(reviewLimits.scope, scope),
            lte(reviewLimits.minute, Math.floor(Date.now() / 900_000) - 4),
          ),
        )
    },
  }
}

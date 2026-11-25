// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { getDatabase } from '@netlify/database'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/netlify-db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { invitations } from '../../db/schema'
import {
  createReviewStore,
  type ReviewDatabase,
  type ReviewInput,
} from './reviewStore'
import { inviteHash, makeInvite } from './reviewValidation'

const enabled = process.env.RUN_REVIEW_DB_TESTS === '1'
const schema = `review_test_${randomUUID().replaceAll('-', '')}`
const moderator = 'synthetic-moderator'
let pool: ReturnType<typeof getDatabase>['pool'] | undefined
let adminPool: ReturnType<typeof getDatabase>['pool'] | undefined
let database: ReviewDatabase
const fixtures = new Map<string, ArrayBuffer>()
const media = {
  set: async (key: string, bytes: Uint8Array<ArrayBuffer>) => {
    fixtures.set(key, bytes.buffer)
  },
  get: async (key: string) => fixtures.get(key) ?? null,
  delete: async (key: string) => {
    fixtures.delete(key)
  },
}
const demo = (
  code: string,
  rating = 4,
  language: 'en' | 'ar' = 'en',
): ReviewInput => ({
  tokenHash: inviteHash(code),
  name: 'Synthetic Review Fixture',
  experience: 'Synthetic test only; not written by a customer.',
  rating,
  language,
  photo: null,
})

describe.skipIf(!enabled)(
  'isolated PostgreSQL review migrations and workflows',
  () => {
    beforeAll(async () => {
      const branch = process.env.NETLIFY_DB_BRANCH
      if (
        !branch ||
        /^(main|master|production|prod|default)$/i.test(branch) ||
        process.env.CONTEXT === 'production'
      )
        throw new Error(
          'Tests require a non-production Netlify database branch',
        )
      const source = getDatabase()
      adminPool = source.pool
      await adminPool.query(`create schema "${schema}"`)
      const url = new URL(source.connectionString)
      url.searchParams.set('options', `-csearch_path=${schema}`)
      const client = getDatabase({ connectionString: url.href })
      pool = client.pool
      const result = await pool.query('select current_schema() as name')
      if (result.rows[0].name !== schema)
        throw new Error('Test schema isolation could not be verified')
      const root = new URL(
        '../../netlify/database/migrations/',
        import.meta.url,
      )
      for (const directory of readdirSync(root, { withFileTypes: true }).filter(
        (entry) => entry.isDirectory(),
      )) {
        const migration = readFileSync(
          new URL(`${directory.name}/migration.sql`, root),
          'utf8',
        )
        await pool.query(migration.replaceAll('--> statement-breakpoint', '\n'))
      }
      database = drizzle({ client })
    }, 25000)

    afterAll(async () => {
      await pool?.end()
      await adminPool?.query(`drop schema if exists "${schema}" cascade`)
      await adminPool?.end()
    })

    it('supports expiry, revocation, invalid invites, and one review per completed job', async () => {
      const store = createReviewStore(database, 'test-invitations', media)
      const { code } = await store.invite('SYNTHETIC-JOB-1', 3, moderator)
      await expect(
        store.checkInvitation(inviteHash(code)),
      ).resolves.toBeUndefined()
      await expect(
        store.checkInvitation(inviteHash(makeInvite())),
      ).rejects.toThrow('invitation')
      await expect(
        store.invite('SYNTHETIC-JOB-1', 3, moderator),
      ).rejects.toThrow('jobConflict')
      const [invite] = (await store.dashboard('pending', 0)).links
      await store.changeInvitation(
        invite.id,
        moderator,
        'Synthetic expiry extension',
        7,
      )
      await database
        .update(invitations)
        .set({ expiresAt: new Date(0) })
        .where(eq(invitations.id, invite.id))
      await expect(store.submit(demo(code), null)).rejects.toThrow('invitation')
      const renewed = await store.invite('SYNTHETIC-JOB-1', 3, moderator)
      await store.changeInvitation(invite.id, moderator, 'Synthetic revocation')
      await expect(store.submit(demo(renewed.code), null)).rejects.toThrow(
        'invitation',
      )
    })

    it('allows exactly one concurrent redemption even for forwarded copies', async () => {
      const store = createReviewStore(database, 'test-redemption', media)
      const { code } = await store.invite('SYNTHETIC-JOB-2', 3, moderator)
      const results = await Promise.allSettled([
        store.submit(demo(code), null),
        store.submit(demo(code, 2, 'ar'), null),
      ])
      expect(results.map((result) => result.status).sort()).toEqual([
        'fulfilled',
        'rejected',
      ])
      expect((await store.dashboard('pending', 0)).items).toHaveLength(1)
      await expect(store.submit(demo(code), null)).rejects.toThrow('invitation')
      await expect(
        store.invite('SYNTHETIC-JOB-2', 3, moderator),
      ).rejects.toThrow('jobConflict')
    })

    it('enforces the rating constraint within the transaction so a valid retry is possible', async () => {
      const store = createReviewStore(database, 'test-constraint', media)
      const { code } = await store.invite('SYNTHETIC-CONSTRAINT', 3, moderator)
      await expect(store.submit(demo(code, 6), null)).rejects.toThrow()
      await expect(store.submit(demo(code, 1), null)).resolves.toBeUndefined()
    })

    it('publishes only approved reviews/photos, hides removals immediately, and scopes records', async () => {
      const store = createReviewStore(database, 'synthetic-preview', media)
      const production = createReviewStore(
        database,
        'synthetic-production',
        media,
      )
      const { code } = await store.invite('SYNTHETIC-PHOTO', 3, moderator)
      await store.submit(demo(code), Uint8Array.of(1, 2, 3))
      const [pending] = (await store.dashboard('pending', 0)).items
      expect(await store.list()).toEqual({
        total: 0,
        average: null,
        reviews: [],
      })
      expect(await store.photo(pending.id)).toBeNull()
      expect(await store.photo(pending.id, true)).toBeInstanceOf(ArrayBuffer)
      await expect(production.submit(demo(code), null)).rejects.toThrow(
        'invitation',
      )
      await store.moderate(
        pending.id,
        'approve',
        moderator,
        'Synthetic approval',
      )
      expect(await store.list()).toMatchObject({
        total: 1,
        average: 4,
        reviews: [{ id: pending.id, hasPhoto: true }],
      })
      expect(await store.photo(pending.id)).toBeInstanceOf(ArrayBuffer)
      expect(await production.photo(pending.id, true)).toBeNull()
      expect((await production.list()).total).toBe(0)
      await store.moderate(
        pending.id,
        'reject',
        moderator,
        'Synthetic rejection',
      )
      expect((await store.list()).total).toBe(0)
      expect(await store.photo(pending.id)).toBeNull()
      expect(await store.photo(pending.id, true)).toBeNull()
      expect(fixtures.size).toBe(0)
      await store.moderate(pending.id, 'delete', moderator, 'Synthetic removal')
      expect((await store.dashboard('rejected', 0)).items).toHaveLength(0)
      expect(await store.photo(pending.id)).toBeNull()
      expect(
        (await store.dashboard('pending', 0)).history.map(
          (item) => item.action,
        ),
      ).toEqual(['delete', 'reject', 'approve', 'invite'])
    })

    it('calculates the total and average across all approved reviews and throttles atomically', async () => {
      const store = createReviewStore(database, 'test-averages', media)
      for (let index = 0; index < 13; index += 1) {
        const { code } = await store.invite(
          `SYNTHETIC-AVG-${index}`,
          3,
          moderator,
        )
        await store.submit(demo(code, index ? 4 : 1), null)
        const [review] = (await store.dashboard('pending', 0)).items
        await store.moderate(review.id, 'approve', moderator, null)
      }
      const feed = await store.list()
      expect(feed.reviews).toHaveLength(12)
      expect(feed).toMatchObject({ total: 13, average: 3.8 })
      const results = await Promise.allSettled(
        Array.from({ length: 4 }, () => store.throttle('synthetic', 2)),
      )
      expect(
        results.filter((result) => result.status === 'fulfilled'),
      ).toHaveLength(2)
    }, 20000)
  },
)

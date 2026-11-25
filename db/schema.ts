import { sql } from 'drizzle-orm'
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const reviewStatus = pgEnum('customer_review_status', [
  'pending',
  'approved',
  'rejected',
  'deleted',
])

export const invitations = pgTable(
  'review_invitations',
  {
    id: uuid().primaryKey().defaultRandom(),
    scope: text().notNull(),
    job: text().notNull(),
    tokenHash: text('token_hash').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('review_invitation_scope_job_unique').on(
      table.scope,
      table.job,
    ),
  ],
)

export const reviewPhotos = pgTable(
  'review_photos',
  {
    id: uuid().primaryKey(),
    scope: text().notNull(),
    cleanupAt: timestamp('cleanup_at', { withTimezone: true }),
  },
  (table) => [
    index('review_photo_cleanup_idx').on(table.scope, table.cleanupAt),
  ],
)

export const reviews = pgTable(
  'customer_reviews',
  {
    id: uuid().primaryKey().defaultRandom(),
    scope: text().notNull(),
    invitationId: uuid('invitation_id')
      .notNull()
      .unique()
      .references(() => invitations.id),
    status: reviewStatus().notNull().default('pending'),
    name: text(),
    rating: integer().notNull(),
    experience: text(),
    language: text().notNull(),
    photoId: uuid('photo_id')
      .unique()
      .references(() => reviewPhotos.id),
    submittedAt: timestamp('submitted_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    moderatedAt: timestamp('moderated_at', { withTimezone: true }),
  },
  (table) => [
    check('customer_review_rating_range', sql`${table.rating} between 1 and 5`),
    check(
      'customer_review_language_check',
      sql`${table.language} in ('en', 'ar')`,
    ),
    check(
      'customer_review_required_content',
      sql`${table.status} in ('rejected', 'deleted') or (${table.name} is not null and ${table.experience} is not null)`,
    ),
    index('customer_review_publication_idx').on(
      table.scope,
      table.status,
      table.submittedAt.desc(),
    ),
  ],
)

export const moderationEvents = pgTable(
  'review_moderation_events',
  {
    id: uuid().primaryKey().defaultRandom(),
    scope: text().notNull(),
    targetId: uuid('target_id').notNull(),
    actor: text().notNull(),
    action: text().notNull(),
    reason: text(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('review_moderation_history_idx').on(
      table.scope,
      table.createdAt.desc(),
    ),
  ],
)

export const reviewLimits = pgTable(
  'review_rate_limits',
  {
    scope: text().notNull(),
    subject: text().notNull(),
    minute: integer().notNull(),
    attempts: integer().notNull().default(1),
  },
  (table) => [
    primaryKey({ columns: [table.scope, table.subject, table.minute] }),
    index('review_rate_limit_expiry_idx').on(table.scope, table.minute),
  ],
)

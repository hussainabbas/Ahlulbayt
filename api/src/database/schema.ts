import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    passwordHash: varchar('password_hash', { length: 255 }),
    displayName: varchar('display_name', { length: 100 }),
    avatarUrl: text('avatar_url'),
    locale: varchar('locale', { length: 10 }).notNull().default('en'),
    role: varchar('role', { length: 20 }).notNull().default('user'),
    tier: varchar('tier', { length: 20 }).notNull().default('free'),
    marja: varchar('marja', { length: 30 }).notNull().default('sistani'),
    isAnonymous: boolean('is_anonymous').notNull().default(false),
    mergedIntoId: uuid('merged_into_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_users_email').on(table.email),
    index('idx_users_tier').on(table.tier),
  ],
);

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 20 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_oauth_provider').on(table.provider, table.providerId)],
);

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
    familyId: uuid('family_id').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_refresh_user').on(table.userId),
    index('idx_refresh_family').on(table.familyId),
  ],
);

export const otpCodes = pgTable(
  'otp_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    codeHash: varchar('code_hash', { length: 64 }).notNull(),
    purpose: varchar('purpose', { length: 30 }).notNull(),
    attempts: integer('attempts').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_otp_email').on(table.email, table.purpose)],
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_reset_user').on(table.userId)],
);

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  prayerMethod: varchar('prayer_method', { length: 30 }).notNull().default('leva'),
  prayerOffsets: jsonb('prayer_offsets').notNull().default({}),
  highLatitudeRule: varchar('high_latitude_rule', { length: 20 }).default('angle_based'),
  theme: varchar('theme', { length: 20 }).notNull().default('dark'),
  muharramMode: varchar('muharram_mode', { length: 20 }).notNull().default('auto'),
  quranTranslationId: uuid('quran_translation_id'),
  quranFontSize: integer('quran_font_size').notNull().default(28),
  quranDisplayMode: varchar('quran_display_mode', { length: 20 }).default('stacked'),
  notificationPrefs: jsonb('notification_prefs').notNull().default({}),
  analyticsEnabled: boolean('analytics_enabled').notNull().default(true),
  locationSharing: boolean('location_sharing').notNull().default(false),
  syncToken: varchar('sync_token', { length: 64 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const devices = pgTable(
  'devices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    platform: varchar('platform', { length: 10 }).notNull(),
    pushToken: varchar('push_token', { length: 512 }).notNull(),
    appVersion: varchar('app_version', { length: 20 }),
    locale: varchar('locale', { length: 10 }),
    timezone: varchar('timezone', { length: 50 }),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_devices_user').on(table.userId),
    uniqueIndex('uq_devices_push_token').on(table.pushToken),
  ],
);

export const syncChangelog = pgTable(
  'sync_changelog',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    entityType: varchar('entity_type', { length: 30 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    operation: varchar('operation', { length: 10 }).notNull(),
    payload: jsonb('payload').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_sync_changelog_user_time').on(table.userId, table.id),
    index('idx_sync_changelog_created').on(table.createdAt),
  ],
);

export const qadhaRecords = pgTable(
  'qadha_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    prayer: varchar('prayer', { length: 10 }).notNull(),
    missedDate: date('missed_date').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_qadha_user').on(table.userId),
    uniqueIndex('uq_qadha_user_prayer_date')
      .on(table.userId, table.prayer, table.missedDate)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentType: varchar('content_type', { length: 20 }).notNull(),
    contentRef: varchar('content_ref', { length: 100 }).notNull(),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_bookmarks_user').on(table.userId),
    uniqueIndex('uq_bookmarks_user_content')
      .on(table.userId, table.contentType, table.contentRef)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export const readingProgress = pgTable(
  'reading_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentType: varchar('content_type', { length: 20 }).notNull(),
    surah: integer('surah'),
    ayah: integer('ayah'),
    progressPct: real('progress_pct'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_reading_progress_user').on(table.userId, table.contentType),
    uniqueIndex('uq_reading_progress').on(table.userId, table.contentType, table.surah),
  ],
);

export const aiConversations = pgTable(
  'ai_conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_ai_conversations_user').on(table.userId, table.updatedAt),
  ],
);

export const aiMessages = pgTable(
  'ai_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => aiConversations.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).notNull(),
    content: text('content').notNull(),
    intent: varchar('intent', { length: 30 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_ai_messages_conversation').on(table.conversationId, table.createdAt),
  ],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    platform: varchar('platform', { length: 10 }).notNull(),
    productId: varchar('product_id', { length: 100 }).notNull(),
    planType: varchar('plan_type', { length: 20 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    originalTxId: varchar('original_tx_id', { length: 255 }).unique(),
    purchaseToken: varchar('purchase_token', { length: 512 }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    isTrial: boolean('is_trial').notNull().default(false),
    isFamilyOwner: boolean('is_family_owner').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_subscriptions_user').on(table.userId),
    index('idx_subscriptions_active').on(table.status, table.expiresAt),
  ],
);

export const subscriptionEvents = pgTable(
  'subscription_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    eventType: varchar('event_type', { length: 30 }).notNull(),
    rawPayload: jsonb('raw_payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_subscription_events_sub').on(table.subscriptionId, table.createdAt),
  ],
);

export const adminAuditLog = pgTable(
  'admin_audit_log',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id),
    action: varchar('action', { length: 50 }).notNull(),
    targetType: varchar('target_type', { length: 30 }),
    targetId: varchar('target_id', { length: 100 }),
    payload: jsonb('payload').notNull().default({}),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_admin_audit_actor').on(table.actorId, table.createdAt),
    index('idx_admin_audit_action').on(table.action, table.createdAt),
  ],
);

export const notificationCampaigns = pgTable(
  'notification_campaigns',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    body: text('body').notNull(),
    segment: jsonb('segment').notNull().default({}),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    recipientCount: integer('recipient_count').notNull().default(0),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_notification_campaigns_status').on(table.status)],
);

export const aiAdminConfig = pgTable('ai_admin_config', {
  key: varchar('key', { length: 50 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const analyticsEventLog = pgTable(
  'analytics_event_log',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventName: varchar('event_name', { length: 50 }).notNull(),
    properties: jsonb('properties').notNull().default({}),
    platform: varchar('platform', { length: 10 }),
    appVersion: varchar('app_version', { length: 20 }),
    sessionId: varchar('session_id', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_analytics_log_name').on(table.eventName, table.createdAt),
    index('idx_analytics_log_user').on(table.userId, table.createdAt),
  ],
);

export const prayerCompletions = pgTable(
  'prayer_completions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    prayer: varchar('prayer', { length: 10 }).notNull(),
    completedDate: date('completed_date').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
    source: varchar('source', { length: 20 }).notNull().default('manual'),
  },
  (table) => [
    uniqueIndex('prayer_completions_user_prayer_date').on(
      table.userId,
      table.prayer,
      table.completedDate,
    ),
    index('idx_prayer_completions_user').on(table.userId, table.completedDate),
    index('idx_prayer_completions_date').on(table.completedDate),
  ],
);

export const readingSessions = pgTable(
  'reading_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentType: varchar('content_type', { length: 20 }).notNull(),
    surah: integer('surah'),
    ayahFrom: integer('ayah_from'),
    ayahTo: integer('ayah_to'),
    durationSeconds: integer('duration_seconds').notNull().default(0),
    ayahsRead: integer('ayahs_read').notNull().default(0),
    progressPct: real('progress_pct'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_reading_sessions_user').on(table.userId, table.createdAt),
    index('idx_reading_sessions_content').on(table.userId, table.contentType),
  ],
);

export const analyticsDailyRollups = pgTable(
  'analytics_daily_rollups',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    rollupDate: date('rollup_date').notNull(),
    metric: varchar('metric', { length: 50 }).notNull(),
    dimension: varchar('dimension', { length: 50 }).notNull().default(''),
    value: real('value').notNull(),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('analytics_daily_rollups_unique').on(table.rollupDate, table.metric, table.dimension),
    index('idx_analytics_rollups_date').on(table.rollupDate, table.metric),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type QadhaRecord = typeof qadhaRecords.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Device = typeof devices.$inferSelect;

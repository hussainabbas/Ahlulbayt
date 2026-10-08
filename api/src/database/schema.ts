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

// ─── Admin RBAC ───────────────────────────────────────────────────────────────

export const adminUsers = pgTable(
  'admin_users',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    department: varchar('department', { length: 50 }),
    title: varchar('title', { length: 100 }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    mfaEnabled: boolean('mfa_enabled').notNull().default(false),
    invitedBy: uuid('invited_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_admin_users_department').on(table.department)],
);

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isSystem: boolean('is_system').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
);

export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 80 }).notNull().unique(),
    resource: varchar('resource', { length: 50 }).notNull(),
    action: varchar('action', { length: 30 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('uq_permissions_resource_action').on(table.resource, table.action)],
);

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_role_permissions').on(table.roleId, table.permissionId),
    index('idx_role_permissions_role').on(table.roleId),
  ],
);

export const adminUserRoles = pgTable(
  'admin_user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    assignedBy: uuid('assigned_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('uq_admin_user_roles').on(table.userId, table.roleId),
    index('idx_admin_user_roles_user').on(table.userId),
  ],
);

// ─── Feature flags ────────────────────────────────────────────────────────────

export const featureFlags = pgTable(
  'feature_flags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 80 }).notNull().unique(),
    name: varchar('name', { length: 120 }).notNull(),
    description: text('description'),
    enabled: boolean('enabled').notNull().default(false),
    rolloutPct: integer('rollout_pct').notNull().default(0),
    metadata: jsonb('metadata').notNull().default({}),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_feature_flags_enabled').on(table.enabled)],
);

export const flagOverrides = pgTable(
  'flag_overrides',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    flagId: uuid('flag_id')
      .notNull()
      .references(() => featureFlags.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    segment: jsonb('segment').notNull().default({}),
    enabled: boolean('enabled').notNull(),
    reason: text('reason'),
    createdBy: uuid('created_by').references(() => users.id),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_flag_overrides_flag').on(table.flagId),
    index('idx_flag_overrides_user').on(table.userId),
  ],
);

// ─── Islamic CMS (polymorphic) ────────────────────────────────────────────────

export const cmsContent = pgTable(
  'cms_content',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    contentType: varchar('content_type', { length: 30 }).notNull(),
    slug: varchar('slug', { length: 120 }).notNull(),
    title: varchar('title', { length: 300 }).notNull(),
    titleAr: varchar('title_ar', { length: 300 }),
    body: jsonb('body').notNull().default({}),
    locale: varchar('locale', { length: 10 }).notNull().default('en'),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    version: integer('version').notNull().default(1),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    metadata: jsonb('metadata').notNull().default({}),
    createdBy: uuid('created_by').references(() => users.id),
    updatedBy: uuid('updated_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('uq_cms_content_type_slug')
      .on(table.contentType, table.slug, table.locale)
      .where(sql`${table.deletedAt} IS NULL`),
    index('idx_cms_content_type_status').on(table.contentType, table.status),
  ],
);

export const contentCitations = pgTable(
  'content_citations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    contentId: uuid('content_id')
      .notNull()
      .references(() => cmsContent.id, { onDelete: 'cascade' }),
    sourceType: varchar('source_type', { length: 30 }).notNull(),
    sourceRef: varchar('source_ref', { length: 200 }).notNull(),
    title: varchar('title', { length: 300 }),
    titleAr: varchar('title_ar', { length: 300 }),
    excerpt: text('excerpt'),
    excerptAr: text('excerpt_ar'),
    surah: integer('surah'),
    ayahFrom: integer('ayah_from'),
    ayahTo: integer('ayah_to'),
    hadithCollection: varchar('hadith_collection', { length: 50 }),
    hadithNumber: varchar('hadith_number', { length: 30 }),
    pageRef: varchar('page_ref', { length: 50 }),
    verificationStatus: varchar('verification_status', { length: 20 }).notNull().default('pending'),
    sortOrder: integer('sort_order').notNull().default(0),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_content_citations_content').on(table.contentId, table.sortOrder),
    index('idx_content_citations_source').on(table.sourceType, table.sourceRef),
  ],
);

// ─── Notifications (extended) ─────────────────────────────────────────────────

export const notificationTemplates = pgTable(
  'notification_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 80 }).notNull().unique(),
    name: varchar('name', { length: 120 }).notNull(),
    titleTemplate: varchar('title_template', { length: 200 }).notNull(),
    bodyTemplate: text('body_template').notNull(),
    channel: varchar('channel', { length: 20 }).notNull().default('push'),
    locale: varchar('locale', { length: 10 }).notNull().default('en'),
    variables: jsonb('variables').notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
);

export const notificationDeliveries = pgTable(
  'notification_deliveries',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => notificationCampaigns.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id').references(() => devices.id, { onDelete: 'set null' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    providerMessageId: varchar('provider_message_id', { length: 255 }),
    errorCode: varchar('error_code', { length: 50 }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    openedAt: timestamp('opened_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_notification_deliveries_campaign').on(table.campaignId, table.status),
    index('idx_notification_deliveries_user').on(table.userId, table.createdAt),
  ],
);

// ─── Islamic events calendar ──────────────────────────────────────────────────

export const islamicEvents = pgTable(
  'islamic_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    titleAr: varchar('title_ar', { length: 200 }),
    description: text('description'),
    eventType: varchar('event_type', { length: 30 }).notNull(),
    hijriMonth: integer('hijri_month'),
    hijriDay: integer('hijri_day'),
    gregorianDate: date('gregorian_date'),
    isRecurring: boolean('is_recurring').notNull().default(true),
    priority: integer('priority').notNull().default(0),
    metadata: jsonb('metadata').notNull().default({}),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_islamic_events_hijri').on(table.hijriMonth, table.hijriDay),
    index('idx_islamic_events_status').on(table.status),
  ],
);

// ─── Media library ────────────────────────────────────────────────────────────

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 300 }).notNull().unique(),
    filename: varchar('filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    width: integer('width'),
    height: integer('height'),
    durationSeconds: integer('duration_seconds'),
    storageProvider: varchar('storage_provider', { length: 20 }).notNull().default('r2'),
    bucket: varchar('bucket', { length: 100 }),
    url: text('url'),
    cdnUrl: text('cdn_url'),
    altText: varchar('alt_text', { length: 300 }),
    tags: jsonb('tags').notNull().default([]),
    uploadedBy: uuid('uploaded_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('idx_media_assets_mime').on(table.mimeType),
    index('idx_media_assets_uploaded').on(table.uploadedBy, table.createdAt),
  ],
);

// ─── API logs & security ──────────────────────────────────────────────────────

export const apiRequestLogs = pgTable(
  'api_request_logs',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    requestId: varchar('request_id', { length: 36 }).notNull(),
    method: varchar('method', { length: 10 }).notNull(),
    path: varchar('path', { length: 500 }).notNull(),
    statusCode: integer('status_code').notNull(),
    durationMs: integer('duration_ms').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 500 }),
    errorCode: varchar('error_code', { length: 50 }),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_api_request_logs_created').on(table.createdAt),
    index('idx_api_request_logs_path').on(table.path, table.createdAt),
    index('idx_api_request_logs_status').on(table.statusCode, table.createdAt),
    index('idx_api_request_logs_user').on(table.userId, table.createdAt),
  ],
);

export const securityEvents = pgTable(
  'security_events',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    severity: varchar('severity', { length: 20 }).notNull().default('info'),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 500 }),
    description: text('description'),
    metadata: jsonb('metadata').notNull().default({}),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolvedBy: uuid('resolved_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_security_events_type').on(table.eventType, table.createdAt),
    index('idx_security_events_severity').on(table.severity, table.createdAt),
    index('idx_security_events_user').on(table.userId, table.createdAt),
  ],
);

/** Future sync: Ramadan Quran goals, charity intentions, fasting notes (mobile-first bundled data today). */
export const ramadanProgress = pgTable(
  'ramadan_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    hijriYear: integer('hijri_year').notNull(),
    hijriMonth: integer('hijri_month').notNull().default(9),
    hijriDay: integer('hijri_day').notNull(),
    quranUnit: varchar('quran_unit', { length: 10 }),
    quranTarget: integer('quran_target'),
    quranProgress: integer('quran_progress').notNull().default(0),
    fastStatus: varchar('fast_status', { length: 20 }),
    charityLog: jsonb('charity_log').notNull().default([]),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('idx_ramadan_progress_user').on(table.userId, table.hijriYear, table.hijriMonth),
    uniqueIndex('ramadan_progress_user_day').on(
      table.userId,
      table.hijriYear,
      table.hijriMonth,
      table.hijriDay,
    ),
  ],
);

// ─── Community support (crypto config — no payment processing) ────────────────

export const supportWallets = pgTable(
  'support_wallets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    network: varchar('network', { length: 20 }).notNull(),
    label: varchar('label', { length: 120 }).notNull(),
    address: varchar('address', { length: 256 }).notNull().default(''),
    enabled: boolean('enabled').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    instructions: jsonb('instructions').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_support_wallets_enabled').on(table.enabled, table.sortOrder)],
);

export const supportCampaigns = pgTable(
  'support_campaigns',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 80 }).notNull().unique(),
    title: jsonb('title').notNull().default({}),
    body: jsonb('body').notNull().default({}),
    active: boolean('active').notNull().default(false),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('idx_support_campaigns_active').on(table.active, table.sortOrder)],
);

export const supportConfig = pgTable('support_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  homeCardEnabled: boolean('home_card_enabled').notNull().default(true),
  transparency: jsonb('transparency').notNull().default({}),
  bankDetails: jsonb('bank_details').notNull().default({}),
  preferredNetwork: varchar('preferred_network', { length: 20 }),
  reminderCooldownDays: integer('reminder_cooldown_days').notNull().default(30),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type QadhaRecord = typeof qadhaRecords.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type CmsContent = typeof cmsContent.$inferSelect;
export type ContentCitation = typeof contentCitations.$inferSelect;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type IslamicEvent = typeof islamicEvents.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type SupportWallet = typeof supportWallets.$inferSelect;
export type SupportCampaign = typeof supportCampaigns.$inferSelect;
export type SupportConfig = typeof supportConfig.$inferSelect;

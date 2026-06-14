-- 0002: Performance indexes and integrity constraints on Phase 1 tables
-- Run after 0001_core_modules.sql

-- users: tier lookup for premium gating
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier) WHERE deleted_at IS NULL;

-- users: self-referential guest merge FK
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_merged_into'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_merged_into
      FOREIGN KEY (merged_into_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- refresh_tokens: expired token cleanup
CREATE INDEX IF NOT EXISTS idx_refresh_expires
  ON refresh_tokens(expires_at)
  WHERE revoked_at IS NULL;

-- devices: unique push token (upsert semantics)
CREATE UNIQUE INDEX IF NOT EXISTS uq_devices_push_token ON devices(push_token);

-- qadha: pending prayers partial index
CREATE INDEX IF NOT EXISTS idx_qadha_user_pending
  ON qadha_records(user_id)
  WHERE completed_at IS NULL AND deleted_at IS NULL;

-- qadha: idempotent create (active rows only)
CREATE UNIQUE INDEX IF NOT EXISTS uq_qadha_user_prayer_date
  ON qadha_records(user_id, prayer, missed_date)
  WHERE deleted_at IS NULL;

-- bookmarks: active-only lookup
DROP INDEX IF EXISTS idx_bookmarks_user;
CREATE INDEX IF NOT EXISTS idx_bookmarks_user
  ON bookmarks(user_id)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_bookmarks_user_content
  ON bookmarks(user_id, content_type, content_ref)
  WHERE deleted_at IS NULL;

-- reading_progress: one row per user+content+surah
CREATE UNIQUE INDEX IF NOT EXISTS uq_reading_progress
  ON reading_progress(user_id, content_type, COALESCE(surah, 0));

CREATE INDEX IF NOT EXISTS idx_reading_progress_lookup
  ON reading_progress(user_id, content_type);

-- sync_changelog: retention purge helper
CREATE INDEX IF NOT EXISTS idx_sync_changelog_created
  ON sync_changelog(created_at);

-- ai: conversation history ordered
DROP INDEX IF EXISTS idx_ai_conversations_user;
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user
  ON ai_conversations(user_id, updated_at DESC);

DROP INDEX IF EXISTS idx_ai_messages_conversation;
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation
  ON ai_messages(conversation_id, created_at);

-- DOWN (manual rollback):
-- DROP INDEX IF EXISTS idx_users_tier;
-- DROP INDEX IF EXISTS idx_refresh_expires;
-- DROP INDEX IF EXISTS uq_devices_push_token;
-- ... etc.

-- Core modules: preferences, sync, worship tracking, devices, AI
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    prayer_method           VARCHAR(30) NOT NULL DEFAULT 'leva',
    prayer_offsets          JSONB NOT NULL DEFAULT '{}',
    high_latitude_rule      VARCHAR(20) DEFAULT 'angle_based',
    theme                   VARCHAR(20) NOT NULL DEFAULT 'dark',
    muharram_mode           VARCHAR(20) NOT NULL DEFAULT 'auto',
    quran_translation_id    UUID,
    quran_font_size         INTEGER NOT NULL DEFAULT 28,
    quran_display_mode      VARCHAR(20) DEFAULT 'stacked',
    notification_prefs      JSONB NOT NULL DEFAULT '{}',
    analytics_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    location_sharing        BOOLEAN NOT NULL DEFAULT FALSE,
    sync_token              VARCHAR(64),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform        VARCHAR(10) NOT NULL,
    push_token      VARCHAR(512) NOT NULL,
    app_version     VARCHAR(20),
    locale          VARCHAR(10),
    timezone        VARCHAR(50),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_push_token ON devices(push_token);

CREATE TABLE IF NOT EXISTS sync_changelog (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type     VARCHAR(30) NOT NULL,
    entity_id       UUID NOT NULL,
    operation       VARCHAR(10) NOT NULL,
    payload         JSONB NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_changelog_user_time ON sync_changelog(user_id, id);

CREATE TABLE IF NOT EXISTS qadha_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prayer          VARCHAR(10) NOT NULL,
    missed_date     DATE NOT NULL,
    completed_at    TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_qadha_user ON qadha_records(user_id);

CREATE TABLE IF NOT EXISTS bookmarks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type    VARCHAR(20) NOT NULL,
    content_ref     VARCHAR(100) NOT NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

CREATE TABLE IF NOT EXISTS reading_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type    VARCHAR(20) NOT NULL,
    surah           INTEGER,
    ayah            INTEGER,
    progress_pct    REAL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);

CREATE TABLE IF NOT EXISTS ai_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);

CREATE TABLE IF NOT EXISTS ai_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL,
    content         TEXT NOT NULL,
    intent          VARCHAR(30),
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);

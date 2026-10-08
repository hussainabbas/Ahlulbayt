-- Analytics platform: event log, prayer completions, reading sessions, daily rollups

CREATE TABLE IF NOT EXISTS analytics_event_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name      VARCHAR(50) NOT NULL,
    properties      JSONB NOT NULL DEFAULT '{}',
    platform        VARCHAR(10),
    app_version     VARCHAR(20),
    session_id      VARCHAR(64),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_log_name ON analytics_event_log(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_log_user ON analytics_event_log(user_id, created_at)
    WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_log_session ON analytics_event_log(session_id)
    WHERE session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS prayer_completions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prayer          VARCHAR(10) NOT NULL CHECK (prayer IN ('fajr', 'dhuhr', 'asr', 'maghrib', 'isha')),
    completed_date  DATE NOT NULL,
    completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source          VARCHAR(20) NOT NULL DEFAULT 'manual',
    UNIQUE(user_id, prayer, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_prayer_completions_user ON prayer_completions(user_id, completed_date DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_completions_date ON prayer_completions(completed_date);

CREATE TABLE IF NOT EXISTS reading_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type    VARCHAR(20) NOT NULL CHECK (content_type IN ('quran', 'dua', 'ziyarat', 'hadith')),
    surah           INTEGER,
    ayah_from       INTEGER,
    ayah_to         INTEGER,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    ayahs_read      INTEGER NOT NULL DEFAULT 0,
    progress_pct    REAL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON reading_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_content ON reading_sessions(user_id, content_type);

CREATE TABLE IF NOT EXISTS analytics_daily_rollups (
    id              BIGSERIAL PRIMARY KEY,
    rollup_date     DATE NOT NULL,
    metric          VARCHAR(50) NOT NULL,
    dimension       VARCHAR(50) NOT NULL DEFAULT '',
    value           REAL NOT NULL,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(rollup_date, metric, dimension)
);

CREATE INDEX IF NOT EXISTS idx_analytics_rollups_date ON analytics_daily_rollups(rollup_date, metric);

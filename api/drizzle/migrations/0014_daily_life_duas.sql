-- Daily Life Duas: taxonomy, sources, audio, scheduling

ALTER TABLE duas
  ADD COLUMN IF NOT EXISTS kind VARCHAR(20) NOT NULL DEFAULT 'major'
    CHECK (kind IN ('major', 'daily_life', 'taqibat')),
  ADD COLUMN IF NOT EXISTS situation_key VARCHAR(80),
  ADD COLUMN IF NOT EXISTS quick_action BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notification_rule JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS bundle_version INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS text_checksum VARCHAR(64),
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'review', 'verified', 'published', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_duas_kind ON duas(kind, sort_order);
CREATE INDEX IF NOT EXISTS idx_duas_situation ON duas(situation_key) WHERE situation_key IS NOT NULL;

ALTER TABLE dua_translations
  ADD COLUMN IF NOT EXISTS narrator VARCHAR(200),
  ADD COLUMN IF NOT EXISTS source_book VARCHAR(200),
  ADD COLUMN IF NOT EXISTS source_ref VARCHAR(120),
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}';

-- ─── Category taxonomy ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dua_categories (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         VARCHAR(50) NOT NULL UNIQUE,
    parent_slug  VARCHAR(50) REFERENCES dua_categories(slug) ON DELETE SET NULL,
    titles       JSONB NOT NULL DEFAULT '{}',
    icon         VARCHAR(50),
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dua_category_items (
    category_id  UUID NOT NULL REFERENCES dua_categories(id) ON DELETE CASCADE,
    dua_id       UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (category_id, dua_id)
);

CREATE INDEX IF NOT EXISTS idx_dua_category_items_dua ON dua_category_items(dua_id);

-- ─── Source attribution ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dua_sources (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dua_id       UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    source_type  VARCHAR(30) NOT NULL
      CHECK (source_type IN ('book', 'hadith', 'quran', 'scholar')),
    source_book  VARCHAR(200),
    source_ref   VARCHAR(120),
    narrator     VARCHAR(200),
    chain        TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
      CHECK (verification_status IN ('pending', 'verified', 'disputed', 'rejected')),
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dua_sources_dua ON dua_sources(dua_id, sort_order);

-- ─── Audio tracks ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dua_audio_tracks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dua_id       UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    reciter_slug VARCHAR(50) NOT NULL,
    reciter_name VARCHAR(120) NOT NULL,
    s3_key       TEXT NOT NULL,
    duration_sec INTEGER,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (dua_id, reciter_slug)
);

CREATE INDEX IF NOT EXISTS idx_dua_audio_dua ON dua_audio_tracks(dua_id);

-- ─── Daily picks (today's dua rotation) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS dua_daily_picks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dua_id       UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    rule_type    VARCHAR(20) NOT NULL
      CHECK (rule_type IN ('fixed_date', 'day_of_week', 'hijri_day', 'random_pool')),
    rule_value   JSONB NOT NULL DEFAULT '{}',
    priority     INTEGER NOT NULL DEFAULT 0,
    active_from  DATE,
    active_until DATE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dua_daily_picks_rule ON dua_daily_picks(rule_type, priority);

-- Seed top-level categories (titles only — no dua text)
INSERT INTO dua_categories (slug, parent_slug, titles, icon, sort_order) VALUES
  ('home', NULL, '{"en":"Home","ur":"گھر","ar":"المنزل"}', 'home', 1),
  ('sleep', NULL, '{"en":"Sleep","ur":"نیند","ar":"النوم"}', 'moon', 2),
  ('bathroom', NULL, '{"en":"Bathroom","ur":"بیت الخلا","ar":"الخلاء"}', 'droplet', 3),
  ('travel', NULL, '{"en":"Travel","ur":"سفر","ar":"السفر"}', 'car', 4),
  ('food', NULL, '{"en":"Food","ur":"کھانا","ar":"الطعام"}', 'utensils', 5),
  ('family', NULL, '{"en":"Family","ur":"خاندان","ar":"الأسرة"}', 'heart', 6),
  ('work', NULL, '{"en":"Work","ur":"کام","ar":"العمل"}', 'briefcase', 7),
  ('health', NULL, '{"en":"Health","ur":"صحت","ar":"الصحة"}', 'activity', 8),
  ('protection', NULL, '{"en":"Protection","ur":"حفاظت","ar":"الحماية"}', 'shield', 9),
  ('prayer', NULL, '{"en":"Prayer Related","ur":"نماز","ar":"الصلاة"}', 'pray', 10)
ON CONFLICT (slug) DO NOTHING;

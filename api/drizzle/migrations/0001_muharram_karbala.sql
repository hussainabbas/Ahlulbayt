-- Stub migration for future CMS-backed Muharram/Karbala content sync.
-- Mobile ships bundled JSON; this schema mirrors types for optional API hosting.

CREATE TABLE IF NOT EXISTS muharram_day_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day INTEGER NOT NULL UNIQUE CHECK (day BETWEEN 1 AND 30),
  title JSONB NOT NULL,
  narrative JSONB NOT NULL,
  significance JSONB NOT NULL,
  worship JSONB NOT NULL,
  karbala_event_ids JSONB NOT NULL DEFAULT '[]',
  related_masoomeen_ids JSONB NOT NULL DEFAULT '[]',
  bundle_version INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS karbala_events (
  id VARCHAR(80) PRIMARY KEY,
  muharram_day INTEGER NOT NULL,
  hijri_label VARCHAR(40) NOT NULL,
  event_order INTEGER NOT NULL,
  time_of_day VARCHAR(20),
  title JSONB NOT NULL,
  narrative JSONB NOT NULL,
  significance JSONB NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]',
  martyr_ids JSONB NOT NULL DEFAULT '[]',
  bundle_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS karbala_martyrs (
  id VARCHAR(80) PRIMARY KEY,
  name JSONB NOT NULL,
  honorific JSONB,
  role JSONB NOT NULL,
  shahadat_day INTEGER NOT NULL,
  narrative JSONB NOT NULL,
  significance JSONB NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]',
  masoomeen_id VARCHAR(40),
  bundle_version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_karbala_events_day ON karbala_events (muharram_day, event_order);

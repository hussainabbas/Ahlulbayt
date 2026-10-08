-- Hadith Knowledge Base corpus schema (v2)
-- Supports millions of indexed traditions + isnad graph + user sync

CREATE TABLE IF NOT EXISTS hadith_sources (
  id VARCHAR(32) PRIMARY KEY,
  category VARCHAR(24) NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ur TEXT,
  tradition VARCHAR(16) NOT NULL DEFAULT 'shia',
  corpus_tier SMALLINT NOT NULL DEFAULT 1,
  estimated_total INT NOT NULL DEFAULT 0,
  bundle_version INT NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hadith_narrators (
  id VARCHAR(64) PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  era VARCHAR(24),
  reliability REAL,
  bio_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hadith_entries (
  id VARCHAR(128) PRIMARY KEY,
  source_id VARCHAR(32) NOT NULL REFERENCES hadith_sources(id),
  volume SMALLINT,
  book_slug VARCHAR(64),
  chapter_slug VARCHAR(64),
  hadith_number VARCHAR(32),
  grading VARCHAR(16) NOT NULL DEFAULT 'unknown',
  topics TEXT[] NOT NULL DEFAULT '{}',
  title_en TEXT NOT NULL,
  title_ur TEXT,
  title_ar TEXT,
  arabic TEXT,
  text_en TEXT NOT NULL,
  text_ur TEXT,
  text_ar TEXT,
  summary_en TEXT,
  summary_ur TEXT,
  summary_ar TEXT,
  speaker_en TEXT,
  bundle_version INT NOT NULL DEFAULT 1,
  embedding VECTOR(1536),
  search_vector TSVECTOR,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_id, volume, hadith_number)
);

CREATE INDEX IF NOT EXISTS idx_hadith_entries_search ON hadith_entries USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_hadith_entries_topics ON hadith_entries USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_hadith_entries_source_vol ON hadith_entries (source_id, volume, hadith_number);
CREATE INDEX IF NOT EXISTS idx_hadith_entries_grading ON hadith_entries (grading);

CREATE TABLE IF NOT EXISTS hadith_isnad_links (
  hadith_id VARCHAR(128) NOT NULL REFERENCES hadith_entries(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL,
  narrator_id VARCHAR(64) REFERENCES hadith_narrators(id),
  raw_name_ar TEXT,
  PRIMARY KEY (hadith_id, position)
);

CREATE TABLE IF NOT EXISTS hadith_relations (
  from_id VARCHAR(128) NOT NULL REFERENCES hadith_entries(id) ON DELETE CASCADE,
  to_id VARCHAR(128) NOT NULL REFERENCES hadith_entries(id) ON DELETE CASCADE,
  relation_type VARCHAR(24) NOT NULL,
  weight REAL NOT NULL DEFAULT 1,
  PRIMARY KEY (from_id, to_id, relation_type)
);

CREATE TABLE IF NOT EXISTS hadith_cross_refs (
  shia_id VARCHAR(128) NOT NULL REFERENCES hadith_entries(id) ON DELETE CASCADE,
  sunni_source VARCHAR(32) NOT NULL,
  sunni_ref TEXT NOT NULL,
  note_en TEXT,
  similarity VARCHAR(16) DEFAULT 'related',
  PRIMARY KEY (shia_id, sunni_source, sunni_ref)
);

CREATE TABLE IF NOT EXISTS hadith_bookmarks (
  user_id UUID NOT NULL,
  hadith_id VARCHAR(128) NOT NULL REFERENCES hadith_entries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, hadith_id)
);

-- Trigger helper: populate search_vector (run from application layer on ingest)
-- UPDATE hadith_entries SET search_vector =
--   setweight(to_tsvector('english', coalesce(title_en,'')), 'A') ||
--   setweight(to_tsvector('english', coalesce(text_en,'')), 'B') ||
--   setweight(to_tsvector('simple', coalesce(arabic,'')), 'A');

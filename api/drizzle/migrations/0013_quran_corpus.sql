-- 0013: Quran corpus extensions (metadata indexes, tafsir, audio tracks, translation attribution)

-- Composite lookup for surah+ayah (UNIQUE exists; explicit index for range scans)
CREATE INDEX IF NOT EXISTS idx_quran_ayahs_surah_ayah ON quran_ayahs(surah, ayah);

-- Translation bundle source attribution (licensor / API id)
ALTER TABLE quran_translations
  ADD COLUMN IF NOT EXISTS translation_source TEXT;

COMMENT ON COLUMN quran_translations.translation_source IS
  'Attribution string, e.g. Tanzil.net, Sahih International, Fooladvand';

-- Per-ayah tafsir bodies (bulk text on S3; metadata here)
CREATE TABLE IF NOT EXISTS quran_tafsir (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surah           SMALLINT NOT NULL REFERENCES quran_surahs(number),
    ayah            SMALLINT NOT NULL CHECK (ayah >= 1),
    locale          VARCHAR(5) NOT NULL,
    source          VARCHAR(100) NOT NULL,
    title           TEXT,
    body_key        TEXT NOT NULL,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(surah, ayah, locale, source)
);

CREATE INDEX IF NOT EXISTS idx_quran_tafsir_surah_ayah ON quran_tafsir(surah, ayah);

-- Reciter audio track catalog (per-surah or per-ayah granularity)
CREATE TABLE IF NOT EXISTS quran_audio_tracks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reciter_slug    VARCHAR(50) NOT NULL,
    surah           SMALLINT NOT NULL REFERENCES quran_surahs(number),
    ayah_start      SMALLINT NOT NULL DEFAULT 1 CHECK (ayah_start >= 1),
    ayah_end        SMALLINT NOT NULL CHECK (ayah_end >= 1),
    s3_key          TEXT NOT NULL,
    duration_ms     INTEGER,
    bitrate_kbps    SMALLINT,
    checksum_sha256 CHAR(64),
    bundle_version  INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(reciter_slug, surah, ayah_start, ayah_end)
);

CREATE INDEX IF NOT EXISTS idx_quran_audio_reciter_surah ON quran_audio_tracks(reciter_slug, surah);

-- DOWN (reference only):
-- DROP TABLE IF EXISTS quran_audio_tracks;
-- DROP TABLE IF EXISTS quran_tafsir;
-- DROP INDEX IF EXISTS idx_quran_ayahs_surah_ayah;
-- ALTER TABLE quran_translations DROP COLUMN IF EXISTS translation_source;

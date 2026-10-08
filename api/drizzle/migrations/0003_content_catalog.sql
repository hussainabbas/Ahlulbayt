-- 0003: Content catalog metadata (bulk text on S3/CDN)

CREATE TABLE IF NOT EXISTS holy_sites (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(50) NOT NULL UNIQUE,
    name_key        VARCHAR(100) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    country         VARCHAR(2),
    imam_ref        VARCHAR(50),
    mapbox_tile_id  VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quran_surahs (
    number          SMALLINT PRIMARY KEY CHECK (number BETWEEN 1 AND 114),
    name_arabic     VARCHAR(50) NOT NULL,
    name_english    VARCHAR(50) NOT NULL,
    name_translit   VARCHAR(50),
    revelation      VARCHAR(10) NOT NULL CHECK (revelation IN ('meccan', 'medinan')),
    ayah_count      SMALLINT NOT NULL,
    juz_start       SMALLINT,
    sort_order      SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS quran_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(20) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    language        VARCHAR(5) NOT NULL,
    translator      VARCHAR(100),
    is_shia         BOOLEAN NOT NULL DEFAULT FALSE,
    s3_bundle_key   TEXT NOT NULL,
    bundle_version  INTEGER NOT NULL DEFAULT 1,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quran_ayahs (
    id              BIGSERIAL PRIMARY KEY,
    surah           SMALLINT NOT NULL REFERENCES quran_surahs(number),
    ayah            SMALLINT NOT NULL CHECK (ayah >= 1),
    juz             SMALLINT NOT NULL CHECK (juz BETWEEN 1 AND 30),
    hizb            SMALLINT,
    page_madinah    SMALLINT,
    has_sajdah      BOOLEAN NOT NULL DEFAULT FALSE,
    text_key        TEXT NOT NULL,
    UNIQUE(surah, ayah)
);

CREATE INDEX IF NOT EXISTS idx_quran_ayahs_juz ON quran_ayahs(juz);

CREATE TABLE IF NOT EXISTS duas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) NOT NULL UNIQUE,
    category        VARCHAR(50) NOT NULL,
    mafatih_ref     VARCHAR(50),
    title_key       VARCHAR(100) NOT NULL,
    repeat_count    SMALLINT,
    audio_s3_key    TEXT,
    audio_duration  INTEGER,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_duas_category ON duas(category, sort_order);

CREATE TABLE IF NOT EXISTS dua_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dua_id          UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL,
    title           TEXT NOT NULL,
    arabic_text     TEXT,
    translation     TEXT,
    transliteration TEXT,
    s3_body_key     TEXT,
    UNIQUE(dua_id, locale)
);

CREATE TABLE IF NOT EXISTS ziyarat (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) NOT NULL UNIQUE,
    imam_ref        VARCHAR(50),
    holy_site_id    UUID REFERENCES holy_sites(id) ON DELETE SET NULL,
    title_key       VARCHAR(100) NOT NULL,
    audio_s3_key    TEXT,
    recommended_days TEXT[],
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ziyarat_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ziyarat_id      UUID NOT NULL REFERENCES ziyarat(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL,
    title           TEXT NOT NULL,
    arabic_text     TEXT NOT NULL,
    translation     TEXT,
    transliteration TEXT,
    UNIQUE(ziyarat_id, locale)
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) NOT NULL UNIQUE,
    event_type      VARCHAR(20) NOT NULL CHECK (event_type IN ('wiladat', 'shahadat', 'holiday', 'occasion', 'fasting', 'amaal')),
    hijri_month     SMALLINT NOT NULL CHECK (hijri_month BETWEEN 1 AND 12),
    hijri_day       SMALLINT NOT NULL CHECK (hijri_day BETWEEN 1 AND 30),
    imam_ref        VARCHAR(50),
    priority        SMALLINT NOT NULL DEFAULT 0,
    amaal_dua_ids   UUID[],
    amaal_ziyarat_ids UUID[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_hijri ON calendar_events(hijri_month, hijri_day);

CREATE TABLE IF NOT EXISTS calendar_event_translations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    locale          VARCHAR(5) NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    UNIQUE(event_id, locale)
);

CREATE TABLE IF NOT EXISTS hijri_date_overrides (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code     VARCHAR(10) NOT NULL,
    gregorian_date  DATE NOT NULL,
    hijri_year      SMALLINT NOT NULL,
    hijri_month     SMALLINT NOT NULL,
    hijri_day       SMALLINT NOT NULL,
    source          VARCHAR(100),
    confirmed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(region_code, gregorian_date)
);

CREATE TABLE IF NOT EXISTS content_manifests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version         VARCHAR(20) NOT NULL UNIQUE,
    bundles         JSONB NOT NULL,
    published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_manifest_version ON content_manifests(version);

-- FK: user_preferences → quran_translations (deferred until translations seeded)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_prefs_quran_translation'
  ) THEN
    ALTER TABLE user_preferences
      ADD CONSTRAINT fk_user_prefs_quran_translation
      FOREIGN KEY (quran_translation_id) REFERENCES quran_translations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 0007: Analytics (partitioned) & mosque geo search

-- Requires cube + earthdistance for GiST geo index
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE TABLE IF NOT EXISTS mosques (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    address         TEXT,
    country         VARCHAR(2),
    prayer_times    JSONB,
    method          VARCHAR(30),
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mosques_geo
  ON mosques USING gist (ll_to_earth(latitude::float8, longitude::float8));

CREATE INDEX IF NOT EXISTS idx_mosques_country ON mosques(country) WHERE verified = TRUE;

-- Partitioned analytics (parent table)
CREATE TABLE IF NOT EXISTS analytics_events (
    id              BIGSERIAL,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name      VARCHAR(50) NOT NULL,
    properties      JSONB NOT NULL DEFAULT '{}',
    platform        VARCHAR(10),
    app_version     VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Bootstrap current month partition (adjust date range as needed)
CREATE TABLE IF NOT EXISTS analytics_events_2026_06
  PARTITION OF analytics_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE IF NOT EXISTS analytics_events_2026_07
  PARTITION OF analytics_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE INDEX IF NOT EXISTS idx_analytics_events_name
  ON analytics_events(event_name, created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user
  ON analytics_events(user_id, created_at)
  WHERE user_id IS NOT NULL;

-- Helper: create next month's partition (run via pg_cron monthly)
CREATE OR REPLACE FUNCTION create_analytics_partition(p_start DATE)
RETURNS void AS $$
DECLARE
  v_end DATE := p_start + INTERVAL '1 month';
  v_name TEXT := 'analytics_events_' || to_char(p_start, 'YYYY_MM');
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF analytics_events FOR VALUES FROM (%L) TO (%L)',
    v_name, p_start, v_end
  );
END;
$$ LANGUAGE plpgsql;

-- Retention: drop partitions older than 13 months
-- SELECT create_analytics_partition('2026-08-01'::date);

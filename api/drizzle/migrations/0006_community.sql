-- 0006: Community events & worship extras

CREATE TABLE IF NOT EXISTS tasbih_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dhikr_type      VARCHAR(50) NOT NULL,
    target_count    INTEGER NOT NULL CHECK (target_count > 0),
    current_count   INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasbih_user_active
  ON tasbih_sessions(user_id)
  WHERE completed_at IS NULL;

CREATE TABLE IF NOT EXISTS community_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    event_type      VARCHAR(30) NOT NULL CHECK (event_type IN ('majlis', 'lecture', 'ashura', 'other')),
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ,
    location_name   VARCHAR(200),
    latitude        DECIMAL(9,6),
    longitude       DECIMAL(9,6),
    is_virtual      BOOLEAN NOT NULL DEFAULT FALSE,
    stream_url      TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_events_time
  ON community_events(starts_at)
  WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_community_events_organizer
  ON community_events(organizer_id);

CREATE TABLE IF NOT EXISTS community_rsvps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_community_rsvps_user ON community_rsvps(user_id);

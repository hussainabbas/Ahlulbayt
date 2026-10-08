-- Admin platform: RBAC, CMS, feature flags, events, media, logs, security
-- Partition-friendly api_request_logs uses monthly range partitions (manual attach in prod)

-- ─── RBAC ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
    user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department    VARCHAR(50),
    title         VARCHAR(100),
    last_login_at TIMESTAMPTZ,
    mfa_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
    invited_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_department ON admin_users(department);

CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_system   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(80) NOT NULL UNIQUE,
    resource    VARCHAR(50) NOT NULL,
    action      VARCHAR(30) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (resource, action)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);

CREATE TABLE IF NOT EXISTS admin_user_roles (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_user_roles_user ON admin_user_roles(user_id);

-- Seed system roles
INSERT INTO roles (slug, name, description, is_system) VALUES
    ('moderator', 'Moderator', 'Read-mostly access; content editing', TRUE),
    ('admin', 'Admin', 'Operational admin access', TRUE),
    ('super_admin', 'Super Admin', 'Full platform control', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ─── Feature flags ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feature_flags (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key          VARCHAR(80) NOT NULL UNIQUE,
    name         VARCHAR(120) NOT NULL,
    description  TEXT,
    enabled      BOOLEAN NOT NULL DEFAULT FALSE,
    rollout_pct  INTEGER NOT NULL DEFAULT 0 CHECK (rollout_pct BETWEEN 0 AND 100),
    metadata     JSONB NOT NULL DEFAULT '{}',
    created_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

CREATE TABLE IF NOT EXISTS flag_overrides (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id    UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    segment    JSONB NOT NULL DEFAULT '{}',
    enabled    BOOLEAN NOT NULL,
    reason     TEXT,
    created_by UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flag_overrides_flag ON flag_overrides(flag_id);
CREATE INDEX IF NOT EXISTS idx_flag_overrides_user ON flag_overrides(user_id);

-- ─── Islamic CMS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cms_content (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(30) NOT NULL
        CHECK (content_type IN ('quran_meta', 'hadith', 'dua', 'ziyarat', 'event', 'amaal', 'guide_step')),
    slug         VARCHAR(120) NOT NULL,
    title        VARCHAR(300) NOT NULL,
    title_ar     VARCHAR(300),
    body         JSONB NOT NULL DEFAULT '{}',
    locale       VARCHAR(10) NOT NULL DEFAULT 'en',
    status       VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'review', 'published', 'archived')),
    version      INTEGER NOT NULL DEFAULT 1,
    published_at TIMESTAMPTZ,
    metadata     JSONB NOT NULL DEFAULT '{}',
    created_by   UUID REFERENCES users(id),
    updated_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_cms_content_type_slug
    ON cms_content(content_type, slug, locale) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cms_content_type_status ON cms_content(content_type, status);

CREATE TABLE IF NOT EXISTS content_citations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id          UUID NOT NULL REFERENCES cms_content(id) ON DELETE CASCADE,
    source_type         VARCHAR(30) NOT NULL,
    source_ref          VARCHAR(200) NOT NULL,
    title               VARCHAR(300),
    title_ar            VARCHAR(300),
    excerpt             TEXT,
    excerpt_ar          TEXT,
    surah               INTEGER,
    ayah_from           INTEGER,
    ayah_to             INTEGER,
    hadith_collection   VARCHAR(50),
    hadith_number       VARCHAR(30),
    page_ref            VARCHAR(50),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'disputed', 'rejected')),
    sort_order          INTEGER NOT NULL DEFAULT 0,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_citations_content ON content_citations(content_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_content_citations_source ON content_citations(source_type, source_ref);

-- ─── Notification extensions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key             VARCHAR(80) NOT NULL UNIQUE,
    name            VARCHAR(120) NOT NULL,
    title_template  VARCHAR(200) NOT NULL,
    body_template   TEXT NOT NULL,
    channel         VARCHAR(20) NOT NULL DEFAULT 'push',
    locale          VARCHAR(10) NOT NULL DEFAULT 'en',
    variables       JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_deliveries (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campaign_id         UUID NOT NULL REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    device_id           UUID REFERENCES devices(id) ON DELETE SET NULL,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'opened')),
    provider_message_id VARCHAR(255),
    error_code          VARCHAR(50),
    sent_at             TIMESTAMPTZ,
    opened_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_deliveries_campaign ON notification_deliveries(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_user ON notification_deliveries(user_id, created_at);

-- ─── Islamic events ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS islamic_events (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug           VARCHAR(120) NOT NULL UNIQUE,
    title          VARCHAR(200) NOT NULL,
    title_ar       VARCHAR(200),
    description    TEXT,
    event_type     VARCHAR(30) NOT NULL,
    hijri_month    INTEGER CHECK (hijri_month BETWEEN 1 AND 12),
    hijri_day      INTEGER CHECK (hijri_day BETWEEN 1 AND 30),
    gregorian_date DATE,
    is_recurring   BOOLEAN NOT NULL DEFAULT TRUE,
    priority       INTEGER NOT NULL DEFAULT 0,
    metadata       JSONB NOT NULL DEFAULT '{}',
    status         VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    published_at   TIMESTAMPTZ,
    created_by     UUID REFERENCES users(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_islamic_events_hijri ON islamic_events(hijri_month, hijri_day);
CREATE INDEX IF NOT EXISTS idx_islamic_events_status ON islamic_events(status);

-- ─── Media library ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS media_assets (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key              VARCHAR(300) NOT NULL UNIQUE,
    filename         VARCHAR(255) NOT NULL,
    mime_type        VARCHAR(100) NOT NULL,
    size_bytes       BIGINT NOT NULL,
    width            INTEGER,
    height           INTEGER,
    duration_seconds INTEGER,
    storage_provider VARCHAR(20) NOT NULL DEFAULT 'r2',
    bucket           VARCHAR(100),
    url              TEXT,
    cdn_url          TEXT,
    alt_text         VARCHAR(300),
    tags             JSONB NOT NULL DEFAULT '[]',
    uploaded_by      UUID REFERENCES users(id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_media_assets_mime ON media_assets(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded ON media_assets(uploaded_by, created_at);

-- ─── API request logs (partition parent) ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_request_logs (
    id           BIGINT GENERATED ALWAYS AS IDENTITY,
    request_id   VARCHAR(36) NOT NULL,
    method       VARCHAR(10) NOT NULL,
    path         VARCHAR(500) NOT NULL,
    status_code  INTEGER NOT NULL,
    duration_ms  INTEGER NOT NULL,
    user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address   VARCHAR(45),
    user_agent   VARCHAR(500),
    error_code   VARCHAR(50),
    metadata     JSONB NOT NULL DEFAULT '{}',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_path ON api_request_logs(path, created_at);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_status ON api_request_logs(status_code, created_at);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_user ON api_request_logs(user_id, created_at);

-- Default partition for dev (prod: monthly partitions)
CREATE TABLE IF NOT EXISTS api_request_logs_default PARTITION OF api_request_logs DEFAULT;

-- ─── Security events ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS security_events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_type  VARCHAR(50) NOT NULL,
    severity    VARCHAR(20) NOT NULL DEFAULT 'info'
        CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(500),
    description TEXT,
    metadata    JSONB NOT NULL DEFAULT '{}',
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity, created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id, created_at);

-- ─── Admin user view (read model) ─────────────────────────────────────────────

CREATE OR REPLACE VIEW user_admin_view AS
SELECT
    u.id,
    u.email,
    u.display_name,
    u.role,
    u.tier,
    u.locale,
    u.marja,
    u.is_anonymous,
    u.email_verified,
    u.created_at,
    u.updated_at,
    u.deleted_at,
    (SELECT COUNT(*)::INTEGER FROM devices d WHERE d.user_id = u.id) AS device_count,
    (SELECT MAX(d.last_seen_at) FROM devices d WHERE d.user_id = u.id) AS last_seen_at,
    (SELECT COUNT(*)::INTEGER FROM subscriptions s
        WHERE s.user_id = u.id AND s.status = 'active') AS active_subscriptions,
    (SELECT COUNT(*)::INTEGER FROM analytics_event_log a
        WHERE a.user_id = u.id AND a.created_at > NOW() - INTERVAL '30 days') AS events_30d
FROM users u;

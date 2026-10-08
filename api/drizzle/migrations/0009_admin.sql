-- Admin dashboard: audit log + notification campaigns (phase 2)
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id    UUID NOT NULL REFERENCES users(id),
    action      VARCHAR(50) NOT NULL,
    target_type VARCHAR(30),
    target_id   VARCHAR(100),
    payload     JSONB NOT NULL DEFAULT '{}',
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_actor ON admin_audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON admin_audit_log(action, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    body            TEXT NOT NULL,
    segment         JSONB NOT NULL DEFAULT '{}',
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    recipient_count INTEGER NOT NULL DEFAULT 0,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status ON notification_campaigns(status);

CREATE TABLE IF NOT EXISTS ai_admin_config (
    key         VARCHAR(50) PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_by  UUID REFERENCES users(id),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ai_admin_config (key, value) VALUES
    ('global', '{"enabled": true, "provider": "local", "maxDailyQueriesFree": 10, "maxDailyQueriesPremium": 200}'::jsonb),
    ('guardrails', '{"blockedPatterns": ["\\\\b(kill|violence|suicide)\\\\b"]}'::jsonb)
ON CONFLICT (key) DO NOTHING;

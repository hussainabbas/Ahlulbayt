-- 0004: Subscriptions & family sharing (Apple/Google IAP)

CREATE TABLE IF NOT EXISTS subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform            VARCHAR(10) NOT NULL CHECK (platform IN ('apple', 'google')),
    product_id          VARCHAR(100) NOT NULL,
    status              VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired', 'grace', 'cancelled', 'paused')),
    original_tx_id      VARCHAR(255) UNIQUE,
    expires_at          TIMESTAMPTZ,
    is_trial            BOOLEAN NOT NULL DEFAULT FALSE,
    is_family_owner     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active
  ON subscriptions(status, expires_at)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS family_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code     VARCHAR(8),
    accepted_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(owner_id, member_id),
    CHECK (owner_id <> member_id)
);

CREATE INDEX IF NOT EXISTS idx_family_owner ON family_members(owner_id);
CREATE INDEX IF NOT EXISTS idx_family_member ON family_members(member_id);

CREATE TABLE IF NOT EXISTS subscription_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    event_type      VARCHAR(30) NOT NULL,
    raw_payload     JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_events_sub
  ON subscription_events(subscription_id, created_at DESC);

-- Sync user tier from active subscription (application-level or trigger)
CREATE OR REPLACE FUNCTION sync_user_tier_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND (NEW.expires_at IS NULL OR NEW.expires_at > NOW()) THEN
    UPDATE users SET tier = 'premium', updated_at = NOW() WHERE id = NEW.user_id;
  ELSIF OLD.status = 'active' AND NEW.status <> 'active' THEN
    UPDATE users SET tier = 'free', updated_at = NOW()
    WHERE id = NEW.user_id
      AND NOT EXISTS (
        SELECT 1 FROM subscriptions s
        WHERE s.user_id = NEW.user_id AND s.status = 'active'
          AND (s.expires_at IS NULL OR s.expires_at > NOW())
          AND s.id <> NEW.id
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_user_tier ON subscriptions;
CREATE TRIGGER trg_sync_user_tier
  AFTER INSERT OR UPDATE OF status, expires_at ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_user_tier_from_subscription();

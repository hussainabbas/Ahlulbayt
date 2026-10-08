-- Extend subscriptions for monetization plan types
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20),
  ADD COLUMN IF NOT EXISTS purchase_token VARCHAR(512);

UPDATE subscriptions SET plan_type = 'monthly' WHERE plan_type IS NULL;

ALTER TABLE subscriptions
  ALTER COLUMN plan_type SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_tx ON subscriptions(original_tx_id);

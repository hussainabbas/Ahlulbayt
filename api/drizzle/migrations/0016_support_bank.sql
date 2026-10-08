-- Bank transfer details for Community Support (display-only, no payment processing)

ALTER TABLE support_config
  ADD COLUMN IF NOT EXISTS bank_details JSONB NOT NULL DEFAULT '{}';

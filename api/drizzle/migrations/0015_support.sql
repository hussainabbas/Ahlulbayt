-- Community Support (crypto donations config — no payment processing)

-- ─── Wallets ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_wallets (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network      VARCHAR(20) NOT NULL
                   CHECK (network IN ('btc', 'eth', 'usdt_trc20', 'usdt_erc20')),
    label        VARCHAR(120) NOT NULL,
    address      VARCHAR(256) NOT NULL DEFAULT '',
    enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    instructions JSONB NOT NULL DEFAULT '{}',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_wallets_enabled ON support_wallets(enabled, sort_order);

-- ─── Campaigns ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_campaigns (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug       VARCHAR(80) NOT NULL UNIQUE,
    title      JSONB NOT NULL DEFAULT '{}',
    body       JSONB NOT NULL DEFAULT '{}',
    active     BOOLEAN NOT NULL DEFAULT FALSE,
    starts_at  TIMESTAMPTZ,
    ends_at    TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_campaigns_active ON support_campaigns(active, sort_order);

-- ─── Singleton config ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_config (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_card_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    transparency           JSONB NOT NULL DEFAULT '{}',
    preferred_network      VARCHAR(20)
                             CHECK (preferred_network IS NULL OR preferred_network IN ('btc', 'eth', 'usdt_trc20', 'usdt_erc20')),
    reminder_cooldown_days INTEGER NOT NULL DEFAULT 30,
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO support_config (home_card_enabled, transparency, reminder_cooldown_days)
SELECT TRUE,
       '{"hosting":"Server hosting and CDN","notifications":"Push notification delivery","ai":"AI assistant infrastructure","development":"App development and maintenance"}'::jsonb,
       30
WHERE NOT EXISTS (SELECT 1 FROM support_config LIMIT 1);

-- ─── Seed placeholder wallets (configure in admin) ─────────────────────────────

INSERT INTO support_wallets (network, label, address, enabled, sort_order, instructions)
SELECT * FROM (VALUES
  ('btc'::varchar, 'Bitcoin (BTC)'::varchar, 'Configure in admin'::varchar, TRUE, 1, '{"en":"Send only BTC to this address."}'::jsonb),
  ('eth', 'Ethereum (ETH)', 'Configure in admin', TRUE, 2, '{"en":"Send only ETH to this address."}'::jsonb),
  ('usdt_trc20', 'USDT (TRC20)', 'Configure in admin', TRUE, 3, '{"en":"Send only USDT on TRON (TRC20) network."}'::jsonb),
  ('usdt_erc20', 'USDT (ERC20)', 'Configure in admin', TRUE, 4, '{"en":"Send only USDT on Ethereum (ERC20) network."}'::jsonb)
) AS v(network, label, address, enabled, sort_order, instructions)
WHERE NOT EXISTS (SELECT 1 FROM support_wallets LIMIT 1);

INSERT INTO support_campaigns (slug, title, body, active, sort_order)
SELECT 'community-support',
       '{"en":"Support AhlulBayt+","ur":"AhlulBayt+ کی حمایت کریں","ar":"ادعم أهل البيت+"}'::jsonb,
       '{"en":"Help keep the app ad-free and community-supported.","ur":"ایپ کو اشتہار سے پاک رکھنے میں مدد کریں۔","ar":"ساعد في إبقاء التطبيق بدون إعلانات."}'::jsonb,
       TRUE,
       1
WHERE NOT EXISTS (SELECT 1 FROM support_campaigns LIMIT 1);

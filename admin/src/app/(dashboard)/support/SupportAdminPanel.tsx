'use client';

import { useCallback, useEffect, useState } from 'react';

import { adminApi, type SupportAdminSnapshot } from '@/lib/api';

export function SupportAdminPanel({ token }: { token?: string }) {
  const [data, setData] = useState<SupportAdminSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await adminApi.supportSnapshot(token));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load support config');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleHomeCard = async () => {
    if (!data?.config) return;
    setSaving(true);
    try {
      await adminApi.updateSupportConfig({ homeCardEnabled: !data.config.homeCardEnabled }, token);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const toggleWallet = async (id: string, enabled: boolean) => {
    setSaving(true);
    try {
      await adminApi.updateSupportWallet(id, { enabled: !enabled }, token);
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <p className="px-4 py-6 text-sm text-destructive">{error}</p>;
  }

  if (!data) {
    return <p className="px-4 py-6 text-sm text-muted-foreground">Loading support configuration…</p>;
  }

  return (
    <div className="space-y-6 p-4">
      <section className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Global config</h2>
            <p className="text-xs text-muted-foreground">Home card, transparency, preferred network</p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => void toggleHomeCard()}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium"
          >
            Home card: {data.config?.homeCardEnabled ? 'on' : 'off'}
          </button>
        </div>
        <div className="grid gap-2 px-4 py-3 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Preferred network:</span>{' '}
            {data.config?.preferredNetwork ?? 'none'}
          </p>
          <p>
            <span className="text-muted-foreground">Reminder cooldown:</span>{' '}
            {data.config?.reminderCooldownDays ?? 30} days
          </p>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Crypto wallets</h2>
          <p className="text-xs text-muted-foreground">Enable/disable and reorder via admin API</p>
        </div>
        <div className="divide-y">
          {data.wallets.items.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{w.label}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{w.address || '—'}</p>
                <p className="text-xs text-muted-foreground">{w.network}</p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={() => void toggleWallet(w.id, w.enabled)}
                className={
                  w.enabled
                    ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600'
                    : 'rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                }
              >
                {w.enabled ? 'enabled' : 'disabled'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Campaigns</h2>
        </div>
        {data.campaigns.items.length ? (
          <div className="divide-y">
            {data.campaigns.items.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-mono text-xs">{c.slug}</p>
                  <p className="text-muted-foreground">{String((c.title as Record<string, string>)?.en ?? '')}</p>
                </div>
                <span
                  className={
                    c.active
                      ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600'
                      : 'rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
                  }
                >
                  {c.active ? 'active' : 'inactive'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-6 text-sm text-muted-foreground">No campaigns yet.</p>
        )}
      </section>
    </div>
  );
}

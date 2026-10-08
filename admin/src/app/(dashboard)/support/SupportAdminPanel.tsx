'use client';

import { useCallback, useEffect, useState } from 'react';

import { adminApi, type SupportAdminSnapshot, type SupportBankDetailsRow } from '@/lib/api';

type WalletDraft = {
  label: string;
  address: string;
  instructionsEn: string;
};

const EMPTY_BANK: SupportBankDetailsRow = {
  enabled: false,
  accountName: '',
  bankName: '',
  iban: '',
  swift: '',
  accountNumber: '',
  referenceNote: '',
  instructionsEn: '',
};

function readBankDetails(raw: unknown): SupportBankDetailsRow {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_BANK };
  const b = raw as Record<string, unknown>;
  const instructions = b.instructions as Record<string, string> | undefined;
  return {
    enabled: Boolean(b.enabled),
    accountName: String(b.accountName ?? ''),
    bankName: String(b.bankName ?? ''),
    iban: String(b.iban ?? ''),
    swift: String(b.swift ?? ''),
    accountNumber: String(b.accountNumber ?? ''),
    referenceNote: String(b.referenceNote ?? ''),
    instructionsEn: instructions?.en ?? '',
  };
}

function toBankPayload(draft: SupportBankDetailsRow): Record<string, unknown> {
  return {
    enabled: draft.enabled,
    accountName: draft.accountName.trim() || undefined,
    bankName: draft.bankName.trim() || undefined,
    iban: draft.iban.trim() || undefined,
    swift: draft.swift.trim() || undefined,
    accountNumber: draft.accountNumber.trim() || undefined,
    referenceNote: draft.referenceNote.trim() || undefined,
    instructions: draft.instructionsEn.trim() ? { en: draft.instructionsEn.trim() } : undefined,
  };
}

export function SupportAdminPanel({ token }: { token?: string }) {
  const [data, setData] = useState<SupportAdminSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [walletDraft, setWalletDraft] = useState<WalletDraft>({
    label: '',
    address: '',
    instructionsEn: '',
  });
  const [bankDraft, setBankDraft] = useState<SupportBankDetailsRow>({ ...EMPTY_BANK });
  const [bankDirty, setBankDirty] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const snapshot = await adminApi.supportSnapshot(token);
      setData(snapshot);
      setBankDraft(readBankDetails(snapshot.config?.bankDetails));
      setBankDirty(false);
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

  const startEditWallet = (wallet: SupportAdminSnapshot['wallets']['items'][number]) => {
    const instructions = wallet.instructions as Record<string, string> | undefined;
    setEditingWalletId(wallet.id);
    setWalletDraft({
      label: wallet.label,
      address: wallet.address,
      instructionsEn: instructions?.en ?? '',
    });
  };

  const saveWallet = async (id: string) => {
    setSaving(true);
    try {
      await adminApi.updateSupportWallet(
        id,
        {
          label: walletDraft.label.trim(),
          address: walletDraft.address.trim(),
          instructions: walletDraft.instructionsEn.trim()
            ? { en: walletDraft.instructionsEn.trim() }
            : {},
        },
        token,
      );
      setEditingWalletId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const saveBankDetails = async () => {
    setSaving(true);
    setBankError(null);
    try {
      const payload = toBankPayload(bankDraft);
      await adminApi.updateSupportConfig({ bankDetails: payload }, token);
      setBankDirty(false);
      await load();
    } catch (e) {
      setBankError(e instanceof Error ? e.message : 'Failed to save bank details');
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
          <p className="text-xs text-muted-foreground">
            Edit addresses below — they appear in the mobile app with copy + QR. No payment processing.
          </p>
        </div>
        <div className="divide-y">
          {data.wallets.items.map((w) => {
            const isEditing = editingWalletId === w.id;
            return (
              <div key={w.id} className="space-y-3 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{w.label}</p>
                    <p className="text-xs text-muted-foreground">{w.network}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!isEditing ? (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => startEditWallet(w)}
                        className="rounded-lg border px-2.5 py-1 text-xs font-medium"
                      >
                        Edit
                      </button>
                    ) : null}
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
                </div>

                {isEditing ? (
                  <div className="grid gap-3 rounded-lg border bg-muted/30 p-3">
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-muted-foreground">Label</span>
                      <input
                        className="rounded-md border bg-background px-2 py-1.5 text-sm"
                        value={walletDraft.label}
                        onChange={(e) => setWalletDraft((d) => ({ ...d, label: e.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-muted-foreground">Wallet address</span>
                      <textarea
                        className="min-h-[72px] rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
                        value={walletDraft.address}
                        onChange={(e) => setWalletDraft((d) => ({ ...d, address: e.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1 text-xs">
                      <span className="font-medium text-muted-foreground">Instructions (English)</span>
                      <input
                        className="rounded-md border bg-background px-2 py-1.5 text-sm"
                        placeholder="e.g. Send only BTC to this address."
                        value={walletDraft.instructionsEn}
                        onChange={(e) =>
                          setWalletDraft((d) => ({ ...d, instructionsEn: e.target.value }))
                        }
                      />
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void saveWallet(w.id)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      >
                        Save wallet
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setEditingWalletId(null)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {w.address || '—'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Bank transfer / IBAN</h2>
            <p className="text-xs text-muted-foreground">
              Optional — shown in the app as copy-only bank details (no in-app payments).
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setBankDraft((d) => ({ ...d, enabled: !d.enabled }));
              setBankDirty(true);
              setBankError(null);
            }}
            className={
              bankDraft.enabled
                ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600'
                : 'rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground'
            }
          >
            {bankDraft.enabled ? 'enabled' : 'disabled'}
          </button>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2">
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground">Account holder name</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
              value={bankDraft.accountName}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, accountName: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground">Bank name</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
              value={bankDraft.bankName}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, bankName: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs md:col-span-2">
            <span className="font-medium text-muted-foreground">IBAN</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
              placeholder="PKxx xxxx xxxx xxxx xxxx xxxx"
              value={bankDraft.iban}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, iban: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground">SWIFT / BIC (optional)</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
              value={bankDraft.swift}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, swift: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground">Account number (optional)</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
              value={bankDraft.accountNumber}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, accountNumber: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs md:col-span-2">
            <span className="font-medium text-muted-foreground">Payment reference note (optional)</span>
            <input
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
              placeholder="e.g. Include your name in the transfer reference"
              value={bankDraft.referenceNote}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, referenceNote: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          <label className="grid gap-1 text-xs md:col-span-2">
            <span className="font-medium text-muted-foreground">Instructions (English)</span>
            <textarea
              className="min-h-[64px] rounded-md border bg-background px-2 py-1.5 text-sm"
              placeholder="e.g. International transfers only. Allow 2–3 business days."
              value={bankDraft.instructionsEn}
              onChange={(e) => {
                setBankDraft((d) => ({ ...d, instructionsEn: e.target.value }));
                setBankDirty(true);
              }}
            />
          </label>
          {bankError ? (
            <p className="md:col-span-2 text-xs text-destructive">{bankError}</p>
          ) : null}
          <div className="md:col-span-2">
            <button
              type="button"
              disabled={saving || !bankDirty}
              onClick={() => void saveBankDetails()}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              Save bank details
            </button>
          </div>
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

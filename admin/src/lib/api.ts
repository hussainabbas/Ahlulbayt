const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type FetchOptions = RequestInit & { token?: string };

async function adminFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export interface OverviewKpis {
  totalUsers: number;
  newUsers30d: number;
  signups24h: number;
  premiumSubscriptions: number;
  registeredDevices: number;
  aiConversations30d: number;
  syncEvents30d: number;
}

export interface ExecutiveOverview {
  generatedAt: string;
  kpis: OverviewKpis;
  platform?: {
    activeFeatureFlags: number;
    draftNotificationCampaigns: number;
    publishedIslamicEvents: number;
    securityEvents30d: number;
    recentBans: number;
  };
  charts?: {
    signups30d: Array<{ date: string; count: number }>;
    engagement30d: Array<{ date: string; count: number }>;
  };
}

export interface SupportWalletRow {
  id: string;
  network: string;
  label: string;
  address: string;
  enabled: boolean;
  sortOrder: number;
  instructions: Record<string, string>;
}

export interface SupportCampaignRow {
  id: string;
  slug: string;
  title: Record<string, string>;
  body: Record<string, string>;
  active: boolean;
  sortOrder: number;
}

export interface SupportConfigRow {
  id: string;
  homeCardEnabled: boolean;
  transparency: Record<string, string>;
  preferredNetwork: string | null;
  reminderCooldownDays: number;
}

export interface SupportAdminSnapshot {
  config: SupportConfigRow | null;
  wallets: { items: SupportWalletRow[]; total: number };
  campaigns: { items: SupportCampaignRow[]; total: number };
}

export const adminApi = {
  overview: (token?: string) =>
    adminFetch<ExecutiveOverview>('/v1/admin/overview', { token }),

  analyticsOverview: (token?: string) =>
    adminFetch<{ kpis: OverviewKpis; generatedAt: string }>('/v1/admin/analytics/overview', {
      token,
    }),

  users: (params?: { q?: string; limit?: number }, token?: string) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set('q', params.q);
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return adminFetch<{ items: unknown[]; total: number }>(
      `/v1/admin/users${query ? `?${query}` : ''}`,
      { token },
    );
  },

  health: (token?: string) =>
    adminFetch<{ status: string; services: Record<string, { status: string }> }>(
      '/v1/admin/health',
      { token },
    ),

  flags: (token?: string) =>
    adminFetch<{ items: unknown[]; total: number }>('/v1/admin/flags', { token }),

  audit: (token?: string) =>
    adminFetch<unknown[]>('/v1/admin/audit', { token }),

  campaigns: (token?: string) =>
    adminFetch<{ items: unknown[] }>('/v1/admin/notifications/campaigns', { token }),

  events: (token?: string) =>
    adminFetch<{ items: unknown[]; total: number }>('/v1/admin/events', { token }),

  media: (token?: string) =>
    adminFetch<{ items: unknown[]; total: number }>('/v1/admin/media', { token }),

  securityEvents: (token?: string) =>
    adminFetch<{ items: unknown[] }>('/v1/admin/security/events', { token }),

  requestLogs: (token?: string) =>
    adminFetch<{ items: unknown[] }>('/v1/admin/logs/requests', { token }),

  rbacMatrix: (token?: string) =>
    adminFetch<RbacMatrix>('/v1/admin/rbac/matrix', { token }),

  supportSnapshot: (token?: string) =>
    adminFetch<SupportAdminSnapshot>('/v1/admin/support/config', { token }),

  updateSupportConfig: (body: Record<string, unknown>, token?: string) =>
    adminFetch<unknown>('/v1/admin/support/config', {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    }),

  updateSupportWallet: (id: string, body: Record<string, unknown>, token?: string) =>
    adminFetch<unknown>(`/v1/admin/support/wallets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      token,
    }),
};

export interface RbacRole {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface RbacPermission {
  id: string;
  slug: string;
  resource: string;
  action: string;
  description?: string | null;
}

export interface RbacGrant {
  roleSlug: string;
  permissionSlug: string;
}

export interface RbacMatrix {
  roles: RbacRole[];
  permissions: RbacPermission[];
  grants: RbacGrant[];
  status: string;
  source?: string;
  hint?: string;
}

export { API_BASE };

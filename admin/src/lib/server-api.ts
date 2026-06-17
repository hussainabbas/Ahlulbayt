import { cookies } from 'next/headers';

import { adminApi } from './api';
import { ADMIN_ACCESS_COOKIE } from './auth';

export async function getServerAdminToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ADMIN_ACCESS_COOKIE)?.value;
}

/** Admin API client bound to the httpOnly session cookie (server components). */
export async function getAuthenticatedAdminApi() {
  const token = await getServerAdminToken();

  return {
    token,
    overview: () => adminApi.overview(token),
    analyticsOverview: () => adminApi.analyticsOverview(token),
    users: (params?: { q?: string; limit?: number }) => adminApi.users(params, token),
    health: () => adminApi.health(token),
    flags: () => adminApi.flags(token),
    audit: () => adminApi.audit(token),
    campaigns: () => adminApi.campaigns(token),
    events: () => adminApi.events(token),
    media: () => adminApi.media(token),
    securityEvents: () => adminApi.securityEvents(token),
    requestLogs: () => adminApi.requestLogs(token),
    rbacMatrix: () => adminApi.rbacMatrix(token),
  };
}

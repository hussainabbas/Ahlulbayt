import { useQuery } from '@tanstack/react-query';

import { analyticsApi } from '@/core/analytics/analyticsApi';
import { buildLocalInsights } from '@/core/analytics/localInsights';
import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';
import { isLocalGuestUser } from '@/features/auth/utils/localGuestSession';
import { useAuthStore } from '@/stores/authStore';

export function useUserInsights(days = 30) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const canSyncRemote = Boolean(accessToken) && !isLocalGuestUser(user);

  return useQuery({
    queryKey: ['analytics', 'me', days, canSyncRemote ? 'remote' : 'local'],
    queryFn: async () => {
      if (canSyncRemote && networkManager.getIsConnected()) {
        try {
          return await analyticsApi.getMyInsights(days);
        } catch (error) {
          logger.warn('Remote insights unavailable, using local activity', error);
        }
      }

      return buildLocalInsights(days);
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

export function useInsightsSource() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  return {
    isLocalOnly: !accessToken || isLocalGuestUser(user),
  };
}

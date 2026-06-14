import { useQuery } from '@tanstack/react-query';

import { analyticsApi } from '@/core/analytics/analyticsApi';
import { useAuthStore } from '@/stores/authStore';

export function useUserInsights(days = 30) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['analytics', 'me', days],
    queryFn: () => analyticsApi.getMyInsights(days),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

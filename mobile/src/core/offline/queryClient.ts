import { QueryClient, onlineManager } from '@tanstack/react-query';

import { QUERY_STALE_TIME } from '@/core/config/constants';
import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';

onlineManager.setEventListener((setOnline) => {
  return networkManager.subscribe((isConnected) => {
    setOnline(isConnected);
  });
});

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME.medium,
        gcTime: QUERY_STALE_TIME.long,
        retry: (failureCount, error) => {
          const code = (error as { code?: string })?.code;
          if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') {
            return false;
          }
          return failureCount < 2;
        },
        networkMode: 'offlineFirst',
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
      mutations: {
        networkMode: 'offlineFirst',
        retry: 1,
        onError: (error) => {
          logger.error('Mutation failed', error);
        },
      },
    },
  });
}

import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

import { purchaseService } from '../services/purchaseService';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function SubscriptionBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncFromServer = useSubscriptionStore((s) => s.syncFromServer);

  useEffect(() => {
    void purchaseService.init();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void syncFromServer();
    }
  }, [isAuthenticated, syncFromServer]);

  return null;
}

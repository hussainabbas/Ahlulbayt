import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';

import { shouldShowSubscriptionUi } from '../config';
import { purchaseService } from '../services/purchaseService';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function SubscriptionBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const syncFromServer = useSubscriptionStore((s) => s.syncFromServer);
  const subscriptionsEnabled = shouldShowSubscriptionUi();

  useEffect(() => {
    if (!subscriptionsEnabled) return;
    void purchaseService.init();
  }, [subscriptionsEnabled]);

  useEffect(() => {
    if (!subscriptionsEnabled || !isAuthenticated) return;
    void syncFromServer();
  }, [subscriptionsEnabled, isAuthenticated, syncFromServer]);

  return null;
}

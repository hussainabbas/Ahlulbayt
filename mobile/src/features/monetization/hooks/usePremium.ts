import { useCallback } from 'react';

import type { EntitlementKey } from '../types';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function usePremium() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const plan = useSubscriptionStore((s) => s.plan);
  const expiresAt = useSubscriptionStore((s) => s.expiresAt);
  const tier = useSubscriptionStore((s) => s.tier);

  return { isPremium, plan, expiresAt, tier };
}

export function useEntitlements() {
  const entitlements = useSubscriptionStore((s) => s.entitlements);
  const hasEntitlement = useSubscriptionStore((s) => s.hasEntitlement);

  const check = useCallback(
    (key: EntitlementKey) => hasEntitlement(key),
    [hasEntitlement],
  );

  return { entitlements, hasEntitlement: check };
}

export function usePaywall() {
  const plans = useSubscriptionStore((s) => s.plans);
  const isPurchasing = useSubscriptionStore((s) => s.isPurchasing);
  const isLoading = useSubscriptionStore((s) => s.isLoading);
  const errorKey = useSubscriptionStore((s) => s.errorKey);
  const purchasePlan = useSubscriptionStore((s) => s.purchasePlan);
  const restore = useSubscriptionStore((s) => s.restore);
  const clearError = useSubscriptionStore((s) => s.clearError);
  const loadPlans = useSubscriptionStore((s) => s.loadPlans);

  return {
    plans,
    isPurchasing,
    isLoading,
    errorKey,
    purchasePlan,
    restore,
    clearError,
    loadPlans,
  };
}

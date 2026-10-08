import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';
import { networkManager } from '@/core/offline/network';
import { useAuthStore } from '@/stores/authStore';

import {
  DEFAULT_SUBSCRIPTION_STATE,
  type EntitlementKey,
  type ProductPlan,
  type SubscriptionState,
} from '../types';
import { PRODUCT_PLANS } from '../constants/catalog';
import { areSubscriptionsEnforced } from '../config';
import { purchaseService } from '../services/purchaseService';
import {
  fetchPlans,
  fetchSubscriptionState,
  restorePurchases,
  verifyPurchase,
} from '../services/subscriptionApi';

interface SubscriptionStore extends SubscriptionState {
  plans: ProductPlan[];
  isLoading: boolean;
  isPurchasing: boolean;
  errorKey: string | null;
  setState: (state: SubscriptionState) => void;
  hasEntitlement: (key: EntitlementKey) => boolean;
  syncFromServer: () => Promise<void>;
  loadPlans: () => Promise<void>;
  purchasePlan: (productId: string) => Promise<boolean>;
  restore: () => Promise<boolean>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SUBSCRIPTION_STATE,
      plans: PRODUCT_PLANS,
      isLoading: false,
      isPurchasing: false,
      errorKey: null,

      setState: (state) => set({ ...state }),

      hasEntitlement: (key) =>
        !areSubscriptionsEnforced() ? true : get().entitlements[key] === true,

      syncFromServer: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        if (!networkManager.getIsConnected()) return;
        set({ isLoading: true, errorKey: null });
        try {
          const remote = await fetchSubscriptionState();
          if (remote) {
            set({ ...remote, isLoading: false });
            const user = useAuthStore.getState().user;
            if (user && user.tier !== remote.tier) {
              useAuthStore.getState().setUser({ ...user, tier: remote.tier });
            }
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      loadPlans: async () => {
        if (!networkManager.getIsConnected()) return;
        const remote = await fetchPlans();
        if (remote.length > 0) set({ plans: remote });
      },

      purchasePlan: async (productId) => {
        set({ isPurchasing: true, errorKey: null });
        try {
          const result = await purchaseService.purchase(productId);
          if (!result.success) {
            set({ isPurchasing: false, errorKey: result.errorKey ?? 'premium.errors.purchaseFailed' });
            return false;
          }

          const verified = await verifyPurchase({
            platform: purchaseService.platform(),
            productId: result.productId,
            transactionId: result.transactionId,
          });

          if (!verified) {
            set({ isPurchasing: false, errorKey: 'premium.errors.verifyFailed' });
            return false;
          }

          set({ ...verified, isPurchasing: false });
          const user = useAuthStore.getState().user;
          if (user) {
            useAuthStore.getState().setUser({ ...user, tier: verified.tier });
          }
          return true;
        } catch {
          set({ isPurchasing: false, errorKey: 'premium.errors.purchaseFailed' });
          return false;
        }
      },

      restore: async () => {
        set({ isLoading: true, errorKey: null });
        try {
          await purchaseService.restore();
          const remote = await restorePurchases();
          if (remote?.isPremium) {
            set({ ...remote, isLoading: false });
            const user = useAuthStore.getState().user;
            if (user) useAuthStore.getState().setUser({ ...user, tier: remote.tier });
            return true;
          }
          set({ isLoading: false, errorKey: 'premium.errors.noPurchases' });
          return false;
        } catch {
          set({ isLoading: false, errorKey: 'premium.errors.restoreFailed' });
          return false;
        }
      },

      clearError: () => set({ errorKey: null }),
    }),
    {
      name: 'ahlulbayt-subscription',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({
        isPremium: s.isPremium,
        tier: s.tier,
        plan: s.plan,
        expiresAt: s.expiresAt,
        entitlements: s.entitlements,
        lastSyncedAt: s.lastSyncedAt,
      }),
    },
  ),
);

import { useEffect, useState } from 'react';

import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';

function arePersistStoresHydrated() {
  return useAuthStore.persist.hasHydrated() && useOnboardingStore.persist.hasHydrated();
}

export function useBootstrapReady() {
  const isHydrated = useAppStore((s) => s.isHydrated);
  const [storesHydrated, setStoresHydrated] = useState(arePersistStoresHydrated);

  useEffect(() => {
    if (arePersistStoresHydrated()) {
      setStoresHydrated(true);
      return;
    }

    const unsubAuth = useAuthStore.persist.onFinishHydration(() => {
      if (arePersistStoresHydrated()) setStoresHydrated(true);
    });
    const unsubOnboarding = useOnboardingStore.persist.onFinishHydration(() => {
      if (arePersistStoresHydrated()) setStoresHydrated(true);
    });

    return () => {
      unsubAuth();
      unsubOnboarding();
    };
  }, []);

  return isHydrated && storesHydrated;
}

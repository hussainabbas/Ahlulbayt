import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { usePrayerClockStore } from '@/features/prayer/stores/prayerClockStore';
import { useLocale } from '@/i18n/useLocale';
import { useAdhanStore } from '@/stores/adhanStore';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { pickAdhanSettings } from '../types';
import { AdhanNotificationService } from '../services/adhanNotificationService';

export function useAdhanNotifications() {
  const { t } = useLocale();
  const notificationsGranted = useOnboardingStore((s) => s.notificationsGranted);
  const setLastFingerprint = useAdhanStore((s) => s.setLastScheduledFingerprint);

  const rescheduling = useRef(false);

  const reschedule = useCallback(
    async (force = false) => {
      if (!notificationsGranted || rescheduling.current) return;

      const week = usePrayerClockStore.getState().week;
      if (!week.length) return;

      rescheduling.current = true;
      try {
        const settings = pickAdhanSettings(useAdhanStore.getState());
        const { fingerprint } = await AdhanNotificationService.reschedule(week, settings, t, {
          force,
          lastFingerprint: useAdhanStore.getState().lastScheduledFingerprint,
        });
        setLastFingerprint(fingerprint);
      } finally {
        rescheduling.current = false;
      }
    },
    [t, notificationsGranted, setLastFingerprint],
  );

  useEffect(() => {
    void reschedule();
  }, [reschedule]);

  useEffect(() => {
    const unsub = usePrayerClockStore.subscribe((state, prev) => {
      if (state.dateKey !== prev.dateKey || state.config !== prev.config) {
        void reschedule(true);
      }
    });
    return unsub;
  }, [reschedule]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void reschedule(true);
      }
    });
    return () => sub.remove();
  }, [reschedule]);

  return {
    reschedule,
    requestPermissions: AdhanNotificationService.requestPermissions,
    cancelAll: AdhanNotificationService.cancelAllAdhanNotifications,
    getScheduledCount: AdhanNotificationService.getScheduledCount,
  };
}

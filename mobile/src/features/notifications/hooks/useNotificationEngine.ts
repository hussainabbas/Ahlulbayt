import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { pickAdhanSettings } from '@/features/adhan/types';
import { usePrayerClockStore } from '@/features/prayer/stores/prayerClockStore';
import { useAdhanStore } from '@/stores/adhanStore';
import { useLocale } from '@/i18n/useLocale';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { NotificationEngine } from '../engine/notificationEngine';
import {
  pickNotificationPreferences,
  useNotificationPreferencesStore,
} from '../stores/notificationPreferencesStore';

export function useNotificationEngine() {
  const { t, locale } = useLocale();
  const notificationsGranted = useOnboardingStore((s) => s.notificationsGranted);
  const setLastFingerprint = useNotificationPreferencesStore((s) => s.setLastFingerprint);

  const rescheduling = useRef(false);
  const scheduleGeneration = useRef(0);

  const reschedule = useCallback(
    async (force = false) => {
      if (!notificationsGranted || rescheduling.current) return;

      const week = usePrayerClockStore.getState().week;
      if (!week.length) return;

      rescheduling.current = true;
      const generation = ++scheduleGeneration.current;

      try {
        const prefsState = useNotificationPreferencesStore.getState();
        const { fingerprint } = await NotificationEngine.reschedule(
          pickNotificationPreferences(prefsState),
          t,
          {
            locale,
            force,
            lastFingerprint: useNotificationPreferencesStore.getState().lastScheduledFingerprint,
            prayerWeek: week,
            adhanSettings: pickAdhanSettings(useAdhanStore.getState()),
            notificationsGranted,
          },
        );

        if (generation !== scheduleGeneration.current) return;
        setLastFingerprint(fingerprint);
      } finally {
        rescheduling.current = false;
      }
    },
    [t, locale, notificationsGranted, setLastFingerprint],
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
      if (state === 'active') void reschedule(true);
    });
    return () => sub.remove();
  }, [reschedule]);

  return {
    reschedule,
    requestPermissions: NotificationEngine.requestPermissions,
  };
}

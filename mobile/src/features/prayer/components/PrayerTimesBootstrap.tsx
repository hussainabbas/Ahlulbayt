import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

import { useLocale } from '@/i18n/useLocale';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { PrayerService } from '../services/prayerService';
import {
  refreshPrayerClock,
  startPrayerClock,
  stopPrayerClock,
  subscribePrayerInputs,
  usePrayerClockStore,
} from '../stores/prayerClockStore';

/** Single app-wide prayer clock — avoids duplicate 1 Hz timers per screen. */
export function PrayerTimesBootstrap() {
  const { locale } = useLocale();
  const locationGranted = useOnboardingStore((s) => s.locationGranted);
  const setGpsReady = usePrayerClockStore((s) => s.setGpsReady);

  useEffect(() => {
    startPrayerClock(locale);
    return () => stopPrayerClock();
  }, [locale]);

  useEffect(() => {
    if (!locationGranted) {
      setGpsReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      void PrayerService.refreshLocationFromGps().finally(() => setGpsReady(true));
    });

    return () => task.cancel();
  }, [locationGranted, setGpsReady]);

  useEffect(() => {
    return subscribePrayerInputs(() => refreshPrayerClock(locale));
  }, [locale]);

  return null;
}

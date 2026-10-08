import { useCallback } from 'react';

import type { SupportedLocale } from '@/core/config/constants';
import { useLocale } from '@/i18n/useLocale';

import { usePrayerClockStore } from '../stores/prayerClockStore';

/** Reads from the shared prayer clock — no per-screen timers or recalculation. */
export function usePrayerTimes() {
  const { locale: activeLocale } = useLocale();
  const times = usePrayerClockStore((s) => s.times);
  const schedule = usePrayerClockStore((s) => s.schedule);
  const week = usePrayerClockStore((s) => s.week);
  const nextPrayer = usePrayerClockStore((s) => s.nextPrayer);
  const countdown = usePrayerClockStore((s) => s.countdown);
  const nextPrayerTime = usePrayerClockStore((s) => s.nextPrayerTime);
  const timezone = usePrayerClockStore((s) => s.timezone);
  const cityName = usePrayerClockStore((s) => s.cityName);
  const config = usePrayerClockStore((s) => s.config);
  const formatTimeStore = usePrayerClockStore((s) => s.formatTime);

  const formatTime = useCallback(
    (date: Date) => formatTimeStore(date),
    [formatTimeStore],
  );

  return {
    times,
    schedule,
    week,
    nextPrayer,
    countdown,
    nextPrayerTime,
    timezone,
    cityName,
    config,
    formatTime,
    locale: activeLocale as SupportedLocale,
  };
}

import { useMemo } from 'react';

import { usePrayerClockStore } from '@/features/prayer/stores/prayerClockStore';
import { useLocale } from '@/i18n/useLocale';

import { getFastingCountdown } from '../engine/fastingClock';
import { buildRamadanProgress, isRamadanMonth } from '../engine/ramadanProgress';
import { useFastingStore } from '../stores/fastingStore';

export function useFastingHub() {
  const { locale, t } = useLocale();
  const times = usePrayerClockStore((s) => s.times);
  const tomorrowTimes = usePrayerClockStore((s) => s.tomorrowTimes);
  const now = usePrayerClockStore((s) => s.now);
  const formatTime = usePrayerClockStore((s) => s.formatTime);
  const timezone = usePrayerClockStore((s) => s.timezone);

  const fasts = useFastingStore((s) => s.fasts);
  const missed = useFastingStore((s) => s.missed);
  const toggleFast = useFastingStore((s) => s.toggleFast);
  const isFasted = useFastingStore((s) => s.isFasted);
  const addMissedFast = useFastingStore((s) => s.addMissedFast);
  const markQadaComplete = useFastingStore((s) => s.markQadaComplete);
  const removeMissedFast = useFastingStore((s) => s.removeMissedFast);

  const countdown = useMemo(
    () => getFastingCountdown(times, tomorrowTimes, now),
    [times, tomorrowTimes, now],
  );

  const isRamadan = useMemo(() => isRamadanMonth(now, locale), [now, locale]);

  const progress = useMemo(
    () => buildRamadanProgress(fasts, missed, now),
    [fasts, missed, now],
  );

  const todayKey = now.toISOString().slice(0, 10);

  return {
    t,
    locale,
    countdown,
    isRamadan,
    progress,
    todayKey,
    timezone,
    formatTime,
    fasts,
    missed,
    toggleFast: (kind?: Parameters<typeof toggleFast>[1]) => toggleFast(todayKey, kind, locale),
    toggleFastForDate: (dateKey: string, kind?: Parameters<typeof toggleFast>[1]) =>
      toggleFast(dateKey, kind, locale),
    isFasted: () => isFasted(todayKey),
    addMissedFast: (input: Parameters<typeof addMissedFast>[0]) =>
      addMissedFast(input, locale),
    markQadaComplete,
    removeMissedFast,
  };
}

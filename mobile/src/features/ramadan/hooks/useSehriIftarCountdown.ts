import { useMemo } from 'react';

import { usePrayerClockStore } from '@/features/prayer/stores/prayerClockStore';

import { computeSehriIftar } from '../engine/sehriIftarEngine';

export function useSehriIftarCountdown() {
  const now = usePrayerClockStore((s) => s.now);
  const times = usePrayerClockStore((s) => s.times);
  const tomorrowTimes = usePrayerClockStore((s) => s.tomorrowTimes);
  const formatTime = usePrayerClockStore((s) => s.formatTime);

  return useMemo(
    () => computeSehriIftar(now, times, tomorrowTimes, formatTime),
    [now, times, tomorrowTimes, formatTime],
  );
}

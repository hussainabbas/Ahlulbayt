import { formatCountdown } from '@/core/prayer-engine/format';
import type { PrayerTimes } from '@/core/prayer-engine';

import type { SehriIftarPhase } from '../types';

export interface SehriIftarState {
  phase: SehriIftarPhase;
  targetTime: Date;
  countdown: string;
  countdownMs: number;
  targetLabel: 'sehri' | 'iftar';
  formattedTime: string;
}

function msUntil(target: Date, now: Date): number {
  return Math.max(0, target.getTime() - now.getTime());
}

export function computeSehriIftar(
  now: Date,
  times: PrayerTimes,
  tomorrowTimes: PrayerTimes,
  formatTime: (date: Date) => string,
): SehriIftarState {
  const imsak = times.imsak;
  const maghrib = times.maghrib;
  const tomorrowImsak = tomorrowTimes.imsak;

  if (now < imsak) {
    const ms = msUntil(imsak, now);
    return {
      phase: 'sehri',
      targetTime: imsak,
      countdown: formatCountdown(ms),
      countdownMs: ms,
      targetLabel: 'sehri',
      formattedTime: formatTime(imsak),
    };
  }

  if (now < maghrib) {
    const ms = msUntil(maghrib, now);
    return {
      phase: 'iftar',
      targetTime: maghrib,
      countdown: formatCountdown(ms),
      countdownMs: ms,
      targetLabel: 'iftar',
      formattedTime: formatTime(maghrib),
    };
  }

  const ms = msUntil(tomorrowImsak, now);
  return {
    phase: 'sehri',
    targetTime: tomorrowImsak,
    countdown: formatCountdown(ms),
    countdownMs: ms,
    targetLabel: 'sehri',
    formattedTime: formatTime(tomorrowImsak),
  };
}

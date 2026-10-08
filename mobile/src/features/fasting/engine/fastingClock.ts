import { formatCountdown } from '@/core/prayer-engine';
import type { PrayerTimes } from '@/core/prayer-engine';

import type { FastingCountdownSnapshot, FastingPhase } from '../types';

function msUntil(target: Date, now: Date): number {
  return Math.max(0, target.getTime() - now.getTime());
}

/**
 * Sehri ends at imsak; iftar at maghrib (Jafari prayer engine).
 * After maghrib, countdown targets tomorrow's imsak.
 */
export function getFastingCountdown(
  times: PrayerTimes,
  tomorrowTimes: PrayerTimes,
  now: Date = new Date(),
): FastingCountdownSnapshot {
  const imsak = times.imsak;
  const maghrib = times.maghrib;
  const tomorrowImsak = tomorrowTimes.imsak;

  let phase: FastingPhase;
  let targetTime: Date;
  let targetPrayer: 'imsak' | 'maghrib';

  if (now < imsak) {
    phase = 'sehri';
    targetTime = imsak;
    targetPrayer = 'imsak';
  } else if (now < maghrib) {
    phase = 'iftar';
    targetTime = maghrib;
    targetPrayer = 'maghrib';
  } else {
    phase = 'sehri';
    targetTime = tomorrowImsak;
    targetPrayer = 'imsak';
  }

  const countdownMs = msUntil(targetTime, now);

  return {
    phase,
    targetTime,
    countdownMs,
    countdownFormatted: formatCountdown(countdownMs),
    targetPrayer,
  };
}

export function isCurrentlyFastingWindow(
  times: PrayerTimes,
  now: Date = new Date(),
): boolean {
  return now >= times.imsak && now < times.maghrib;
}

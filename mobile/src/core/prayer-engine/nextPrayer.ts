import type { NextPrayerInfo, PrayerName, PrayerTimeEntry, PrayerTimes } from './types';
import { PRAYER_SCHEDULE_ORDER } from './types';

export function prayerTimesToSchedule(times: PrayerTimes): PrayerTimeEntry[] {
  return PRAYER_SCHEDULE_ORDER.map((name) => ({
    name,
    time: times[name],
  }));
}

function findCurrentPrayer(schedule: PrayerTimeEntry[], nowMs: number): PrayerName | null {
  let current: PrayerName | null = null;
  for (const entry of schedule) {
    const ms = entry.time.getTime();
    if (Number.isFinite(ms) && nowMs >= ms) {
      current = entry.name;
    }
  }
  return current;
}

export function getNextPrayer(
  times: PrayerTimes,
  now: Date = new Date(),
  tomorrowTimes?: PrayerTimes,
): NextPrayerInfo {
  const schedule = prayerTimesToSchedule(times);
  const nowMs = now.getTime();
  const current = findCurrentPrayer(schedule, nowMs);

  const upcoming = schedule
    .filter((entry) => {
      const ms = entry.time.getTime();
      return Number.isFinite(ms) && nowMs < ms;
    })
    .sort((a, b) => a.time.getTime() - b.time.getTime());

  if (upcoming.length > 0) {
    const entry = upcoming[0]!;
    return {
      current,
      next: entry.name,
      nextTime: entry.time,
      all: schedule,
      countdownMs: entry.time.getTime() - nowMs,
    };
  }

  const fajrTomorrow = tomorrowTimes?.fajr ?? (() => {
    const fallback = new Date(times.fajr);
    fallback.setDate(fallback.getDate() + 1);
    return fallback;
  })();

  const tomorrowSchedule = tomorrowTimes
    ? prayerTimesToSchedule(tomorrowTimes)
    : schedule;

  return {
    current: 'isha',
    next: 'fajr',
    nextTime: fajrTomorrow,
    all: tomorrowSchedule,
    countdownMs: fajrTomorrow.getTime() - nowMs,
  };
}

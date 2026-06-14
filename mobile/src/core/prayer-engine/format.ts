import type { PrayerTimeKey, PrayerTimes } from './types';

export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatPrayerTime(date: Date, locale: string, timeZone?: string): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(timeZone ? { timeZone } : {}),
  });
}

export function formatPrayerTimesMap(
  times: PrayerTimes,
  locale: string,
): Record<PrayerTimeKey, string> {
  const keys: PrayerTimeKey[] = [
    'imsak',
    'fajr',
    'sunrise',
    'dhuhr',
    'asr',
    'sunset',
    'maghrib',
    'isha',
    'midnight',
  ];
  return Object.fromEntries(
    keys.map((k) => [k, formatPrayerTime(times[k], locale)]),
  ) as Record<PrayerTimeKey, string>;
}

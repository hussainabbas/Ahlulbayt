import { getString } from '@/core/storage/mmkv';

import { ANALYTICS_EVENTS, type AnalyticsEvent, type UserInsights } from './types';

const QUEUE_KEY = 'analytics-event-queue';
const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

function loadRecentEvents(days: number): AnalyticsEvent[] {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  try {
    const raw = getString(QUEUE_KEY);
    const events = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    return events.filter((event) => {
      const timestamp = event.clientTimestamp
        ? new Date(event.clientTimestamp).getTime()
        : Date.now();
      return timestamp >= since;
    });
  } catch {
    return [];
  }
}

export function buildLocalInsights(days = 30): UserInsights {
  const events = loadRecentEvents(days);

  const sessionCount = events.filter(
    (event) => event.name === ANALYTICS_EVENTS.SESSION_START,
  ).length;

  const prayerCounts = new Map<string, number>();
  for (const event of events) {
    if (event.name !== ANALYTICS_EVENTS.PRAYER_COMPLETED) continue;
    const prayer = typeof event.properties?.prayer === 'string' ? event.properties.prayer : null;
    if (!prayer) continue;
    prayerCounts.set(prayer, (prayerCounts.get(prayer) ?? 0) + 1);
  }

  const prayerTotal = [...prayerCounts.values()].reduce((sum, count) => sum + count, 0);
  const possiblePrayers = days * PRAYER_KEYS.length;

  let ayahsRead = 0;
  for (const event of events) {
    if (event.name === ANALYTICS_EVENTS.QURAN_AYAH_READ) {
      ayahsRead += Number(event.properties?.ayahsRead ?? 1);
    }
  }

  const activeDays = new Set(
    events
      .map((event) => event.clientTimestamp?.slice(0, 10))
      .filter((value): value is string => Boolean(value)),
  ).size;

  return {
    days,
    retention: {
      sessions: sessionCount,
      activeDaysEstimate: Math.min(activeDays, days),
    },
    engagement: {
      sessionCount,
    },
    prayer: {
      totalCompleted: prayerTotal,
      completionRate: possiblePrayers
        ? Math.round((prayerTotal / possiblePrayers) * 1000) / 10
        : 0,
      byPrayer: PRAYER_KEYS.map((prayer) => ({
        prayer,
        count: prayerCounts.get(prayer) ?? 0,
      })),
    },
    reading: {
      sessions: events.filter((event) => event.name === ANALYTICS_EVENTS.QURAN_SESSION).length,
      ayahsRead,
      minutes: 0,
    },
  };
}

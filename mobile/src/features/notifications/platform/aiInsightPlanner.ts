import { getString } from '@/core/storage/mmkv';
import { ANALYTICS_EVENTS, type AnalyticsEvent } from '@/core/analytics/types';

import {
  buildSmartNotificationId,
  dateKeyFromDate,
  DEFAULT_CATEGORY_HOURS,
} from '../constants/channels';
import type { NotificationContext, NotificationPreferences, PlannedNotification } from '../types';

const QUEUE_KEY = 'analytics-event-queue';
const MAX_AI_INSIGHTS_PER_WEEK = 2;

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

function daysSinceLastEvent(events: AnalyticsEvent[], name: string): number | null {
  const matches = events
    .filter((e) => e.name === name)
    .map((e) => (e.clientTimestamp ? new Date(e.clientTimestamp).getTime() : 0))
    .filter((t) => t > 0)
    .sort((a, b) => b - a);

  if (matches.length === 0) return null;
  return Math.floor((Date.now() - matches[0]!) / 86_400_000);
}

function setLocalHour(date: Date, hour: number): Date {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function isInQuietHours(date: Date, prefs: NotificationPreferences): boolean {
  if (!prefs.quietHoursEnabled) return false;
  const h = date.getHours();
  const { quietStartHour, quietEndHour } = prefs;
  if (quietStartHour < quietEndHour) {
    return h >= quietStartHour && h < quietEndHour;
  }
  return h >= quietStartHour || h < quietEndHour;
}

export function planAiInsightNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.ai.enabled) return [];

  const events = loadRecentEvents(14);
  const hour = prefs.categories.ai.digestHour ?? DEFAULT_CATEGORY_HOURS.ai.digestHour;
  const triggerAt = setLocalHour(ctx.now, hour);
  if (triggerAt.getTime() <= ctx.now.getTime()) {
    triggerAt.setDate(triggerAt.getDate() + 1);
  }
  if (isInQuietHours(triggerAt, prefs)) return [];

  const planned: PlannedNotification[] = [];
  const quranGap = daysSinceLastEvent(events, ANALYTICS_EVENTS.QURAN_AYAH_READ);
  const duaOpens = events.filter((e) => e.name === ANALYTICS_EVENTS.DUA_OPENED).length;
  const prayerCount = events.filter((e) => e.name === ANALYTICS_EVENTS.PRAYER_COMPLETED).length;

  if (quranGap != null && quranGap >= 5) {
    planned.push({
      id: buildSmartNotificationId('ai', 'quran_gap', dateKeyFromDate(triggerAt)),
      category: 'ai',
      triggerAt,
      titleKey: 'notifications.ai.quranGap.title',
      bodyKey: 'notifications.ai.quranGap.body',
      titleParams: { days: quranGap },
      bodyParams: { days: quranGap },
      priority: 'default',
      data: {
        category: 'ai',
        route: 'Quran',
        ruleId: 'quran_gap',
        scholarlyReference: {
          source: 'User activity',
          reference: `No Quran read in ${quranGap} days`,
        },
      },
    });
  }

  if (ctx.dayOfWeek === 4 && duaOpens >= 2) {
    planned.push({
      id: buildSmartNotificationId('ai', 'kumayl_habit', dateKeyFromDate(triggerAt)),
      category: 'ai',
      triggerAt: new Date(triggerAt.getTime() + 60 * 60_000),
      titleKey: 'notifications.ai.kumaylHabit.title',
      bodyKey: 'notifications.ai.kumaylHabit.body',
      priority: 'default',
      data: {
        category: 'ai',
        route: 'DuaReader',
        routeParams: { duaId: 'dua_kumail' },
        duaId: 'dua_kumail',
        ruleId: 'kumayl_habit',
        scholarlyReference: {
          source: 'Mafatih al-Jinan',
          bookName: 'Dua Kumayl',
          reference: 'Thursday night',
        },
      },
    });
  }

  if (prayerCount >= 5) {
    planned.push({
      id: buildSmartNotificationId('ai', 'prayer_streak', dateKeyFromDate(triggerAt)),
      category: 'ai',
      triggerAt: new Date(triggerAt.getTime() + 2 * 60 * 60_000),
      titleKey: 'notifications.ai.prayerStreak.title',
      bodyKey: 'notifications.ai.prayerStreak.body',
      titleParams: { days: Math.min(prayerCount, 7) },
      bodyParams: { days: Math.min(prayerCount, 7) },
      priority: 'default',
      data: {
        category: 'ai',
        route: 'Prayer',
        ruleId: 'prayer_streak',
        scholarlyReference: {
          source: 'User activity',
          reference: `${prayerCount} tracked prayers in 14 days`,
        },
      },
    });
  }

  return planned.slice(0, MAX_AI_INSIGHTS_PER_WEEK);
}

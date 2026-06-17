import {
  getGregorianForHijri,
  parseHijriDate,
} from '@/features/calendar/engine/hijriUtils';
import { getUpcomingCalendarEvents } from '@/features/calendar/engine/calendarEngine';
import {
  buildSmartNotificationId,
  dateKeyFromDate,
  DEFAULT_CATEGORY_HOURS,
  SCHEDULE_HORIZON_DAYS,
} from '@/features/notifications/constants/channels';
import type {
  NotificationContext,
  NotificationPreferences,
  PlannedNotification,
} from '@/features/notifications/types';

import { getEventContentSeed } from '../data/eventContentCatalog';
import { getTodayRecommendations } from './recommendationBuilder';

function setLocalHour(date: Date, hour: number, minute = 0): Date {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
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

/**
 * Content-aware calendar notifications — eve reminders and day-of worship prompts
 * with deep links to duas, ziyarat, and profiles. Complements planEventNotifications.
 */
export function planCalendarAiNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.events.enabled) return [];

  const planned: PlannedNotification[] = [];
  const eveningHour =
    prefs.categories.events.eveningHour ?? DEFAULT_CATEGORY_HOURS.events.eveningHour;
  const digestHour =
    prefs.categories.events.digestHour ?? DEFAULT_CATEGORY_HOURS.events.digestHour;

  const todayRecs = getTodayRecommendations(ctx.now, ctx.locale);
  const primaryRec = todayRecs[0];

  if (primaryRec && ctx.hijriMonth && ctx.hijriDay) {
    const todayGregorian = getGregorianForHijri(
      ctx.hijriYear,
      ctx.hijriMonth,
      ctx.hijriDay,
      ctx.locale,
    );
    if (todayGregorian) {
      const morningTrigger = setLocalHour(todayGregorian, digestHour);
      if (
        morningTrigger.getTime() > ctx.now.getTime() &&
        !isInQuietHours(morningTrigger, prefs)
      ) {
        const eventTitleKey = primaryRec.eventId
          ? `calendar.events.${primaryRec.eventId}.title`
          : primaryRec.titleKey;

        planned.push({
          id: buildSmartNotificationId(
            'events',
            `cal-ai-today-${primaryRec.id}`,
            dateKeyFromDate(todayGregorian),
          ),
          category: 'events',
          triggerAt: morningTrigger,
          titleKey: 'islamicCalendarAi.notifications.today.title',
          bodyKey: 'islamicCalendarAi.notifications.today.body',
          titleParams: { event: eventTitleKey },
          bodyParams: { action: primaryRec.titleKey },
          priority: 'high',
          data: {
            category: 'events',
            route: primaryRec.route,
            routeParams: primaryRec.routeParams as Record<string, string> | undefined,
            duaId:
              primaryRec.routeParams && 'duaId' in primaryRec.routeParams
                ? String(primaryRec.routeParams.duaId)
                : undefined,
            eventId: primaryRec.eventId,
            ruleId: `cal-ai-today-${primaryRec.id}`,
          },
        });
      }
    }
  }

  const upcoming = getUpcomingCalendarEvents(
    ctx.hijriMonth,
    ctx.hijriDay,
    8,
    'all',
  ).filter((e) => getEventContentSeed(e.id) != null && e.daysUntil >= 1 && e.daysUntil <= SCHEDULE_HORIZON_DAYS);

  for (const event of upcoming) {
    const seed = getEventContentSeed(event.id);
    if (!seed) continue;

    const eventGregorian = getGregorianForHijri(
      ctx.hijriYear,
      event.hijriMonth,
      event.hijriDay,
      ctx.locale,
    );
    if (!eventGregorian) continue;

    const eve = new Date(eventGregorian);
    eve.setDate(eve.getDate() - 1);
    const eveTrigger = setLocalHour(eve, eveningHour);
    if (eveTrigger.getTime() <= ctx.now.getTime() || isInQuietHours(eveTrigger, prefs)) {
      continue;
    }

    const topItem = seed.items[0];
    planned.push({
      id: buildSmartNotificationId(
        'events',
        `cal-ai-eve-${event.id}`,
        `${dateKeyFromDate(eve)}-eve`,
      ),
      category: 'events',
      triggerAt: eveTrigger,
      titleKey: 'islamicCalendarAi.notifications.eve.title',
      bodyKey: 'islamicCalendarAi.notifications.eve.body',
      titleParams: { event: event.titleKey },
      bodyParams: { action: topItem.titleKey },
      priority: event.priority >= 9 ? 'high' : 'default',
      data: {
        category: 'events',
        route: topItem.route,
        routeParams: topItem.routeParams,
        eventId: event.id,
        ruleId: `cal-ai-eve-${event.id}`,
      },
    });
  }

  return planned;
}

/** Called from notification bootstrap — schedules are merged in planAllNotifications. */
export function scheduleTodayNotifications(): void {
  // Notifications are orchestrated by NotificationEngine.reschedule via planCalendarAiNotifications.
  // This hook exists for explicit bootstrap integration and future local triggers.
}

export function isCalendarAiNotificationDay(date: Date, locale: string): boolean {
  const hijri = parseHijriDate(date, locale);
  return getTodayRecommendations(date, locale).length > 0 || hijri.month === 1 || hijri.month === 9;
}

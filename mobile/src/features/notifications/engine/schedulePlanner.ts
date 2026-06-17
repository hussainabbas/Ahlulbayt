import {
  getGregorianForHijri,
  parseHijriDate,
} from '@/features/calendar/engine/hijriUtils';
import { getUpcomingCalendarEvents } from '@/features/calendar/engine/calendarEngine';

import {
  EVENT_NOTIFICATION_MIN_PRIORITY,
  NOTIFICATION_RULES,
} from '../constants/catalog';
import {
  buildSmartNotificationId,
  dateKeyFromDate,
  DEFAULT_CATEGORY_HOURS,
  SCHEDULE_HORIZON_DAYS,
} from '../constants/channels';
import type {
  NotificationContext,
  NotificationPreferences,
  NotificationRule,
  PlannedNotification,
} from '../types';
import { planAiInsightNotifications } from '../platform/aiInsightPlanner';
import { planDailyContentNotifications } from '../platform/dailyContentPlanner';
import { planCalendarAiNotifications } from '@/core/islamic-calendar-ai';

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

function resolveHour(category: NotificationRule['category'], rule: NotificationRule, prefs: NotificationPreferences): number {
  if (rule.hour != null) return rule.hour;
  const catPrefs = prefs.categories[category];
  return catPrefs.eveningHour ?? DEFAULT_CATEGORY_HOURS[category].eveningHour;
}

function ruleMatchesDay(rule: NotificationRule, ctx: NotificationContext, targetDate: Date): boolean {
  if (rule.muharramOnly && !ctx.isMuharramSeason) return false;
  if (rule.ramadanOnly && !ctx.isRamadan) return false;
  if (rule.dayOfWeek != null && targetDate.getDay() !== rule.dayOfWeek) return false;

  if (rule.hijriMonth != null && rule.hijriDay != null) {
    const hijri = parseHijriDate(targetDate, ctx.locale);
    if (rule.daysBefore != null && rule.daysBefore > 0) {
      const eventDate = getGregorianForHijri(ctx.hijriYear, rule.hijriMonth, rule.hijriDay, ctx.locale);
      if (!eventDate) return false;
      const remindDate = new Date(eventDate);
      remindDate.setDate(remindDate.getDate() - rule.daysBefore);
      return dateKeyFromDate(remindDate) === dateKeyFromDate(targetDate);
    }
    return hijri.month === rule.hijriMonth && hijri.day === rule.hijriDay;
  }

  return rule.daysBefore == null;
}

function planFromRule(
  rule: NotificationRule,
  ctx: NotificationContext,
  prefs: NotificationPreferences,
  targetDate: Date,
): PlannedNotification | null {
  if (!prefs.categories[rule.category]?.enabled) return null;
  if (!ruleMatchesDay(rule, ctx, targetDate)) return null;

  const hour = resolveHour(rule.category, rule, prefs);
  const triggerAt = setLocalHour(targetDate, hour);
  if (triggerAt.getTime() <= ctx.now.getTime()) return null;
  if (isInQuietHours(triggerAt, prefs)) return null;

  const dateKey = dateKeyFromDate(targetDate);
  return {
    id: buildSmartNotificationId(rule.category, rule.id, dateKey),
    category: rule.category,
    triggerAt,
    titleKey: rule.titleKey,
    bodyKey: rule.bodyKey,
    priority: rule.priority,
    data: { ...rule.payload, ruleId: rule.id },
  };
}

export function planCatalogNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  const planned: PlannedNotification[] = [];
  const start = new Date(ctx.now);
  start.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < SCHEDULE_HORIZON_DAYS; offset++) {
    const targetDate = new Date(start);
    targetDate.setDate(targetDate.getDate() + offset);

    for (const rule of NOTIFICATION_RULES) {
      const notification = planFromRule(rule, ctx, prefs, targetDate);
      if (notification) planned.push(notification);
    }
  }

  return planned;
}

export function planEventNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.events.enabled) return [];

  const upcoming = getUpcomingCalendarEvents(
    ctx.hijriMonth,
    ctx.hijriDay,
    12,
    'all',
  ).filter((e) => e.priority >= EVENT_NOTIFICATION_MIN_PRIORITY);

  const planned: PlannedNotification[] = [];
  const digestHour =
    prefs.categories.events.digestHour ?? DEFAULT_CATEGORY_HOURS.events.digestHour;
  const eveningHour =
    prefs.categories.events.eveningHour ?? DEFAULT_CATEGORY_HOURS.events.eveningHour;

  for (const event of upcoming) {
    if (event.daysUntil > SCHEDULE_HORIZON_DAYS) continue;

    const eventGregorian = getGregorianForHijri(
      ctx.hijriYear,
      event.hijriMonth,
      event.hijriDay,
      ctx.locale,
    );
    if (!eventGregorian) continue;

    const morningTrigger = setLocalHour(eventGregorian, digestHour);
    if (morningTrigger.getTime() > ctx.now.getTime() && !isInQuietHours(morningTrigger, prefs)) {
      planned.push({
        id: buildSmartNotificationId('events', event.id, `${dateKeyFromDate(eventGregorian)}-am`),
        category: 'events',
        triggerAt: morningTrigger,
        titleKey: 'notifications.events.today.title',
        bodyKey: 'notifications.events.today.body',
        titleParams: { event: event.titleKey },
        bodyParams: { event: event.titleKey },
        priority: event.priority >= 9 ? 'high' : 'default',
        data: {
          category: 'events',
          route: 'Calendar',
          eventId: event.id,
          ruleId: `event-${event.id}`,
        },
      });
    }

    if (event.daysUntil >= 1) {
      const eve = new Date(eventGregorian);
      eve.setDate(eve.getDate() - 1);
      const eveTrigger = setLocalHour(eve, eveningHour);
      if (eveTrigger.getTime() > ctx.now.getTime() && !isInQuietHours(eveTrigger, prefs)) {
        planned.push({
          id: buildSmartNotificationId('events', event.id, `${dateKeyFromDate(eve)}-eve`),
          category: 'events',
          triggerAt: eveTrigger,
          titleKey: 'notifications.events.eve.title',
          bodyKey: 'notifications.events.eve.body',
          titleParams: { event: event.titleKey, days: event.daysUntil },
          bodyParams: { event: event.titleKey },
          priority: event.priority >= 9 ? 'high' : 'default',
          data: {
            category: 'events',
            route: 'Calendar',
            eventId: event.id,
            ruleId: `event-eve-${event.id}`,
          },
        });
      }
    }
  }

  return planned;
}

export function planMuharramNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.muharram.enabled || !ctx.isMuharramSeason) return [];

  const planned: PlannedNotification[] = [];
  const hour = prefs.categories.muharram.digestHour ?? DEFAULT_CATEGORY_HOURS.muharram.digestHour;

  if (ctx.muharramDay != null && ctx.muharramDay <= 13) {
    const triggerAt = setLocalHour(ctx.now, hour + 1);
    if (triggerAt.getTime() > ctx.now.getTime()) {
      planned.push({
        id: buildSmartNotificationId('muharram', 'day-content', dateKeyFromDate(ctx.now)),
        category: 'muharram',
        triggerAt,
        titleKey: 'notifications.muharram.day.title',
        bodyKey: 'notifications.muharram.day.body',
        titleParams: { day: ctx.muharramDay },
        bodyParams: { day: ctx.muharramDay },
        priority: 'high',
        data: {
          category: 'muharram',
          route: 'MuharramMode',
          ruleId: `muharram-day-${ctx.muharramDay}`,
        },
      });
    }
  }

  return planned;
}

export function planAllNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  const all = [
    ...planCatalogNotifications(ctx, prefs),
    ...planEventNotifications(ctx, prefs),
    ...planCalendarAiNotifications(ctx, prefs),
    ...planMuharramNotifications(ctx, prefs),
    ...planDailyContentNotifications(ctx, prefs),
    ...planAiInsightNotifications(ctx, prefs),
  ];

  const seen = new Set<string>();
  const deduped: PlannedNotification[] = [];

  for (const n of all.sort((a, b) => a.triggerAt.getTime() - b.triggerAt.getTime())) {
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    deduped.push(n);
  }

  return deduped;
}

export function buildScheduleFingerprint(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
  planned: PlannedNotification[],
): string {
  return JSON.stringify({
    hijri: `${ctx.hijriYear}-${ctx.hijriMonth}-${ctx.hijriDay}`,
    prefs: {
      masterEnabled: prefs.masterEnabled,
      quietHoursEnabled: prefs.quietHoursEnabled,
      quietStartHour: prefs.quietStartHour,
      quietEndHour: prefs.quietEndHour,
      categories: prefs.categories,
    },
    ids: planned.map((p) => `${p.id}@${p.triggerAt.getTime()}`),
  });
}

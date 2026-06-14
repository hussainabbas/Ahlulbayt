import { getDailyHadith } from '@/features/hadith/engine/dailyHadithService';
import { getTodaysDua, getTodaysVerse } from '@/features/home/data/dailyContent';
import { pickLocalized } from '@/features/hadith/utils/localize';

import {
  buildSmartNotificationId,
  dateKeyFromDate,
  DEFAULT_CATEGORY_HOURS,
  SCHEDULE_HORIZON_DAYS,
} from '../constants/channels';
import type { NotificationContext, NotificationPreferences, PlannedNotification } from '../types';

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

function truncate(text: string, max = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function planDailyQuranNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.quran.enabled) return [];

  const hour =
    prefs.categories.quran.digestHour ?? DEFAULT_CATEGORY_HOURS.quran.digestHour;
  const planned: PlannedNotification[] = [];
  const start = new Date(ctx.now);
  start.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < SCHEDULE_HORIZON_DAYS; offset++) {
    const targetDate = new Date(start);
    targetDate.setDate(targetDate.getDate() + offset);
    const triggerAt = setLocalHour(targetDate, hour);
    if (triggerAt.getTime() <= ctx.now.getTime()) continue;
    if (isInQuietHours(triggerAt, prefs)) continue;

    const verse = getTodaysVerse(targetDate);
    const reference = `Surah ${verse.surahName} ${verse.reference}`;
    const preview = truncate(verse.translation);

    planned.push({
      id: buildSmartNotificationId('quran', 'daily_verse', dateKeyFromDate(targetDate)),
      category: 'quran',
      triggerAt,
      titleKey: 'notifications.quran.daily.title',
      bodyKey: 'notifications.quran.daily.body',
      directTitle: reference,
      directBody: `${preview}\n\nTap to read full verse.`,
      priority: 'default',
      data: {
        category: 'quran',
        route: 'QuranReader',
        routeParams: { surahNumber: String(verse.surah), ayah: String(verse.ayah) },
        surah: String(verse.surah),
        ayah: String(verse.ayah),
        ruleId: 'daily_verse',
        scholarlyReference: {
          source: 'Holy Quran',
          bookName: verse.surahName,
          reference: verse.reference,
          ayahNumber: String(verse.ayah),
        },
      },
    });
  }

  return planned;
}

export function planDailyHadithNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.hadith.enabled) return [];

  const hour =
    prefs.categories.hadith.digestHour ?? DEFAULT_CATEGORY_HOURS.hadith.digestHour;
  const planned: PlannedNotification[] = [];
  const start = new Date(ctx.now);
  start.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < SCHEDULE_HORIZON_DAYS; offset++) {
    const targetDate = new Date(start);
    targetDate.setDate(targetDate.getDate() + offset);
    const triggerAt = setLocalHour(targetDate, hour);
    if (triggerAt.getTime() <= ctx.now.getTime()) continue;
    if (isInQuietHours(triggerAt, prefs)) continue;

    const hadith = getDailyHadith(targetDate);
    const text = truncate(pickLocalized(hadith.text, ctx.locale));
    const narrator = pickLocalized(hadith.title, ctx.locale);
    const refLabel = pickLocalized(hadith.referenceLabel, ctx.locale);

    planned.push({
      id: buildSmartNotificationId('hadith', 'daily_hadith', dateKeyFromDate(targetDate)),
      category: 'hadith',
      triggerAt,
      titleKey: 'notifications.hadith.daily.title',
      bodyKey: 'notifications.hadith.daily.body',
      directTitle: narrator,
      directBody: `"${text}"\n\nSource: ${hadith.source}${refLabel ? `\n${refLabel}` : ''}`,
      priority: 'default',
      data: {
        category: 'hadith',
        route: 'HadithDetail',
        routeParams: { hadithId: hadith.hadithId },
        hadithId: hadith.hadithId,
        ruleId: 'daily_hadith',
        scholarlyReference: {
          source: hadith.source,
          bookName: hadith.source,
          reference: refLabel,
          hadithNumber: hadith.referenceLabel.en.replace(/[^\d]/g, '') || undefined,
        },
      },
    });
  }

  return planned;
}

export function planDailyDuaDigestNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  if (!prefs.categories.duas.enabled) return [];

  const hour =
    prefs.categories.duas.eveningHour ?? DEFAULT_CATEGORY_HOURS.duas.eveningHour;
  const planned: PlannedNotification[] = [];
  const start = new Date(ctx.now);
  start.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < SCHEDULE_HORIZON_DAYS; offset++) {
    const targetDate = new Date(start);
    targetDate.setDate(targetDate.getDate() + offset);
    const triggerAt = setLocalHour(targetDate, hour);
    if (triggerAt.getTime() <= ctx.now.getTime()) continue;
    if (isInQuietHours(triggerAt, prefs)) continue;

    const dua = getTodaysDua(targetDate);
    const preview = truncate(dua.translation);

    planned.push({
      id: buildSmartNotificationId('duas', 'daily_dua', dateKeyFromDate(targetDate)),
      category: 'duas',
      triggerAt,
      titleKey: 'notifications.duas.daily.title',
      bodyKey: 'notifications.duas.daily.body',
      directTitle: dua.title,
      directBody: `${preview}\n\nSource: Mafatih al-Jinan`,
      priority: 'default',
      data: {
        category: 'duas',
        route: 'Duas',
        ruleId: 'daily_dua',
        scholarlyReference: {
          source: 'Mafatih al-Jinan',
          bookName: dua.title,
          reference: dua.benefit,
        },
      },
    });
  }

  return planned;
}

export function planDailyContentNotifications(
  ctx: NotificationContext,
  prefs: NotificationPreferences,
): PlannedNotification[] {
  return [
    ...planDailyQuranNotifications(ctx, prefs),
    ...planDailyHadithNotifications(ctx, prefs),
    ...planDailyDuaDigestNotifications(ctx, prefs),
  ];
}

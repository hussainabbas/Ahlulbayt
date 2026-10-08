import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { isMuharramSeason } from '@/features/muharram/engine/muharramRepository';

import type { NotificationContext } from '../types';

export function buildNotificationContext(
  now: Date = new Date(),
  locale = 'en',
): NotificationContext {
  const hijri = parseHijriDate(now, locale);
  const isMuharram = isMuharramSeason(hijri.month, hijri.day);

  let muharramDay: number | null = null;
  let daysUntilAshura: number | null = null;

  if (hijri.month === 1) {
    muharramDay = hijri.day;
    daysUntilAshura = Math.max(0, 10 - hijri.day);
  } else if (hijri.month === 12 && hijri.day >= 20) {
    muharramDay = null;
    daysUntilAshura = null;
  }

  return {
    now,
    locale,
    hijriYear: hijri.year,
    hijriMonth: hijri.month,
    hijriDay: hijri.day,
    dayOfWeek: now.getDay(),
    isMuharramSeason: isMuharram,
    muharramDay,
    daysUntilAshura,
    isRamadan: hijri.month === 9,
  };
}

import { getUpcomingCalendarEvents, getTodayEvents } from '@/features/calendar/engine/calendarEngine';
import { formatHijriDate, parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { isMuharramSeason } from '@/features/muharram/engine/muharramRepository';
import {
  formatCountdown,
  formatPrayerTime,
  getNextPrayer,
  type PrayerTimes,
} from '@/core/prayer-engine';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLocationStore } from '@/stores/locationStore';
import { PrayerService } from '@/features/prayer/services/prayerService';
import { usePrayerStore } from '@/stores/prayerStore';

import type { AssistantContext } from '../types';

export function buildAssistantContext(
  locale: string,
  now: Date = new Date(),
): AssistantContext {
  const marja = useSettingsStore.getState().marja;
  const cityName = useLocationStore.getState().cityName;
  const getConfig = usePrayerStore.getState().getConfig;

  const hijri = parseHijriDate(now, locale);
  const config = getConfig();
  const times: PrayerTimes = PrayerService.calculateToday(config, now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = PrayerService.calculateToday(config, tomorrow);
  const next = getNextPrayer(times, now, tomorrowTimes);

  const todayEvents = getTodayEvents(hijri.month, hijri.day);
  const upcoming = getUpcomingCalendarEvents(hijri.month, hijri.day, 4);

  return {
    locale,
    marja,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    hijriFormatted: formatHijriDate(now, locale),
    nextPrayerName: next.next,
    nextPrayerTime: formatPrayerTime(next.nextTime, locale),
    prayerCountdown: formatCountdown(next.countdownMs),
    cityName: cityName ?? 'Unknown',
    todayCalendarEvents: todayEvents.map((e) => e.titleKey),
    upcomingCalendarEvents: upcoming.map((e) => e.titleKey),
    muharramSeason: isMuharramSeason(hijri.month, hijri.day),
    muharramDay: hijri.month === 1 ? hijri.day : null,
  };
}

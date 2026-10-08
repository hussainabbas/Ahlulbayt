/**
 * Notification rules for daily-life duas — all require verified citations before push.
 * @see docs/architecture/DAILY_LIFE_DUAS.md
 */

import type { DailyLifeDuaId } from '../types';

export interface DailyLifeNotificationRule {
  id: string;
  titleKey: string;
  bodyKey: string;
  duaId: DailyLifeDuaId;
  /** Local time HH:mm (24h) */
  time?: string;
  dayOfWeek?: number;
  citationRequired: true;
}

export const DAILY_LIFE_NOTIFICATION_RULES: DailyLifeNotificationRule[] = [
  {
    id: 'daily_dua_morning',
    titleKey: 'dailyLifeDuas.notifications.todaysDua',
    bodyKey: 'dailyLifeDuas.notifications.morningBody',
    duaId: 'dl_after_waking',
    time: '06:00',
    citationRequired: true,
  },
  {
    id: 'daily_dua_evening',
    titleKey: 'dailyLifeDuas.notifications.todaysDua',
    bodyKey: 'dailyLifeDuas.notifications.eveningBody',
    duaId: 'dl_before_sleeping',
    time: '21:00',
    citationRequired: true,
  },
  {
    id: 'leaving_home',
    titleKey: 'dailyLifeDuas.notifications.leavingHomeTitle',
    bodyKey: 'dailyLifeDuas.notifications.leavingHomeBody',
    duaId: 'dl_leaving_home',
    citationRequired: true,
  },
  {
    id: 'friday_dua',
    titleKey: 'dailyLifeDuas.notifications.fridayTitle',
    bodyKey: 'dailyLifeDuas.notifications.fridayBody',
    duaId: 'dl_before_prayer',
    dayOfWeek: 5,
    time: '12:00',
    citationRequired: true,
  },
];

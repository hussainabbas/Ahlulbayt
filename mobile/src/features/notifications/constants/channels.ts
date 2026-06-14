import type { NotificationCategory } from '../types';

export const SMART_NOTIFICATION_PREFIX = 'smart-';

export const SCHEDULE_HORIZON_DAYS = 7;

/** iOS local notification cap — stay well under 64 total with adhan. */
export const MAX_SMART_NOTIFICATIONS = 40;

export const NOTIFICATION_CHANNELS: Record<
  NotificationCategory,
  { id: string; nameKey: string; descriptionKey: string }
> = {
  prayer: {
    id: 'smart-prayer',
    nameKey: 'notifications.channels.prayer',
    descriptionKey: 'notifications.channels.prayerDesc',
  },
  events: {
    id: 'smart-events',
    nameKey: 'notifications.channels.events',
    descriptionKey: 'notifications.channels.eventsDesc',
  },
  duas: {
    id: 'smart-duas',
    nameKey: 'notifications.channels.duas',
    descriptionKey: 'notifications.channels.duasDesc',
  },
  muharram: {
    id: 'smart-muharram',
    nameKey: 'notifications.channels.muharram',
    descriptionKey: 'notifications.channels.muharramDesc',
  },
  amaal: {
    id: 'smart-amaal',
    nameKey: 'notifications.channels.amaal',
    descriptionKey: 'notifications.channels.amaalDesc',
  },
  fasting: {
    id: 'smart-fasting',
    nameKey: 'notifications.channels.fasting',
    descriptionKey: 'notifications.channels.fastingDesc',
  },
};

export const DEFAULT_CATEGORY_HOURS: Record<
  NotificationCategory,
  { digestHour: number; eveningHour: number }
> = {
  prayer: { digestHour: 6, eveningHour: 20 },
  events: { digestHour: 7, eveningHour: 20 },
  duas: { digestHour: 6, eveningHour: 19 },
  muharram: { digestHour: 8, eveningHour: 21 },
  amaal: { digestHour: 9, eveningHour: 18 },
  fasting: { digestHour: 5, eveningHour: 20 },
};

export function buildSmartNotificationId(
  category: NotificationCategory,
  ruleId: string,
  dateKey: string,
): string {
  return `${SMART_NOTIFICATION_PREFIX}${category}-${ruleId}-${dateKey}`;
}

export function dateKeyFromDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

import { analytics } from '@/core/analytics';
import { ANALYTICS_EVENTS } from '@/core/analytics/types';

export function trackNotificationDelivered(data: Record<string, string | undefined>): void {
  analytics.track(ANALYTICS_EVENTS.NOTIFICATION_DELIVERED, {
    category: data.category,
    ruleId: data.ruleId,
    notificationId: data.notificationId,
  });
}

export function trackNotificationOpened(data: Record<string, string | undefined>): void {
  analytics.track(ANALYTICS_EVENTS.NOTIFICATION_OPENED, {
    category: data.category,
    ruleId: data.ruleId,
    route: data.route,
    notificationId: data.notificationId,
  });
}

export function trackNotificationDismissed(data: Record<string, string | undefined>): void {
  analytics.track(ANALYTICS_EVENTS.NOTIFICATION_DISMISSED, {
    category: data.category,
    ruleId: data.ruleId,
  });
}

export function trackNotificationSnoozed(data: Record<string, string | undefined>): void {
  analytics.track(ANALYTICS_EVENTS.NOTIFICATION_SNOOZED, {
    category: data.category,
    prayer: data.prayer,
    minutes: data.minutes ?? '10',
  });
}

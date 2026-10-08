import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

import {
  Notifications,
  type ScheduledNotificationRequest,
} from '@/core/native/notifications';
import { logger } from '@/core/logging/logger';
import type { PrayerTimes } from '@/core/prayer-engine';
import { AdhanNotificationService } from '@/features/adhan/services/adhanNotificationService';
import type { AdhanSettings } from '@/features/adhan/types';

import { NOTIFICATION_CHANNELS, SMART_NOTIFICATION_PREFIX, MAX_SMART_NOTIFICATIONS } from '../constants/channels';
import { getEventById } from '@/features/calendar/engine/calendarEngine';
import { buildNotificationContext } from './contextBuilder';
import {
  buildScheduleFingerprint,
  planAllNotifications,
} from './schedulePlanner';
import type {
  NotificationPreferences,
  NotificationScheduleResult,
  PlannedNotification,
} from '../types';

export type TranslateFn = (key: string, opts?: Record<string, string | number>) => string;

let channelsReady = false;

export async function setupSmartNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android' || channelsReady) return;

  for (const channel of Object.values(NOTIFICATION_CHANNELS)) {
    await notifee.createChannel({
      id: channel.id,
      name: channel.id,
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }
  channelsReady = true;
  logger.info('Smart notification channels configured');
}

export async function cancelAllSmartNotifications(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const smartIds = scheduled
    .map((n) => n.identifier)
    .filter((id) => id.startsWith(SMART_NOTIFICATION_PREFIX));

  await Promise.all(smartIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  return smartIds.length;
}

function enrichPlannedCopy(planned: PlannedNotification, t: TranslateFn): PlannedNotification {
  const titleParams = { ...planned.titleParams };
  const bodyParams = { ...planned.bodyParams };

  if (planned.data.eventId) {
    const event = getEventById(planned.data.eventId);
    if (event) {
      const eventTitle = t(event.titleKey);
      if (titleParams.event !== undefined) titleParams.event = eventTitle;
      if (bodyParams.event !== undefined) bodyParams.event = eventTitle;
    }
  }

  for (const params of [titleParams, bodyParams]) {
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' && value.includes('.')) {
        params[key] = t(value);
      }
    }
  }

  const directTitle = planned.directTitle ?? (planned.titleKey ? t(planned.titleKey, titleParams) : undefined);
  const directBody = planned.directBody ?? (planned.bodyKey ? t(planned.bodyKey, bodyParams) : undefined);

  return {
    ...planned,
    titleParams,
    bodyParams,
    directTitle,
    directBody,
  };
}

function payloadToData(payload: PlannedNotification['data']): Record<string, string> {
  const data: Record<string, string> = { category: payload.category };
  if (payload.route) data.route = payload.route;
  if (payload.eventId) data.eventId = payload.eventId;
  if (payload.duaId) data.duaId = payload.duaId;
  if (payload.hadithId) data.hadithId = payload.hadithId;
  if (payload.surah) data.surah = payload.surah;
  if (payload.ayah) data.ayah = payload.ayah;
  if (payload.ruleId) data.ruleId = payload.ruleId;
  if (payload.routeParams) data.routeParams = JSON.stringify(payload.routeParams);
  if (payload.scholarlyReference) {
    data.scholarlyReference = JSON.stringify(payload.scholarlyReference);
  }
  return data;
}

function toScheduleRequest(
  planned: PlannedNotification,
  t: TranslateFn,
): ScheduledNotificationRequest {
  const channel = NOTIFICATION_CHANNELS[planned.category];

  return {
    identifier: planned.id,
    triggerDate: planned.triggerAt,
    content: {
      title: planned.directTitle ?? t(planned.titleKey, planned.titleParams),
      body: planned.directBody ?? t(planned.bodyKey, planned.bodyParams),
      sound: 'default',
      channelId: channel.id,
      priority: planned.priority === 'high' ? 'max' : 'high',
      data: payloadToData(planned.data),
    },
  };
}

export class NotificationEngine {
  static async reschedule(
    prefs: NotificationPreferences,
    t: TranslateFn,
    options: {
      locale?: string;
      force?: boolean;
      lastFingerprint?: string | null;
      prayerWeek?: PrayerTimes[];
      adhanSettings?: AdhanSettings;
      notificationsGranted?: boolean;
    } = {},
  ): Promise<NotificationScheduleResult> {
    await setupSmartNotificationChannels();

    const ctx = buildNotificationContext(new Date(), options.locale ?? 'en');
    const planned = planAllNotifications(ctx, prefs).slice(0, MAX_SMART_NOTIFICATIONS);
    const fingerprint = buildScheduleFingerprint(ctx, prefs, planned);

    const byCategory: Partial<Record<PlannedNotification['category'], number>> = {};

    if (!options.force && options.lastFingerprint === fingerprint) {
      logger.debug('Notification schedule unchanged, skipping');
      return { scheduled: 0, cancelled: 0, fingerprint, byCategory };
    }

    if (!prefs.masterEnabled || !options.notificationsGranted) {
      const cancelled = await cancelAllSmartNotifications();
      return { scheduled: 0, cancelled, fingerprint, byCategory };
    }

    const cancelled = await cancelAllSmartNotifications();
    let scheduled = 0;

    for (const item of planned) {
      try {
        const enriched = enrichPlannedCopy(item, t);
        await Notifications.scheduleNotificationAsync(toScheduleRequest(enriched, t));
        scheduled += 1;
        byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
      } catch (error) {
        logger.error('Failed to schedule smart notification', error, { id: item.id });
      }
    }

    if (
      prefs.categories.prayer.enabled &&
      options.prayerWeek?.length &&
      options.adhanSettings &&
      options.notificationsGranted
    ) {
      await AdhanNotificationService.reschedule(options.prayerWeek, options.adhanSettings, t, {
        force: options.force,
      });
      byCategory.prayer = options.prayerWeek.length;
    }

    logger.info('Intelligent notifications scheduled', { scheduled, cancelled, fingerprint });
    return { scheduled, cancelled, fingerprint, byCategory };
  }

  static async requestPermissions(): Promise<boolean> {
    return AdhanNotificationService.requestPermissions();
  }
}

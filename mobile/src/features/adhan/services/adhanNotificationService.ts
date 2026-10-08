import {
  Notifications,
  configureForegroundHandler,
  setupNotificationChannels,
} from '@/core/native/notifications';
import { logger } from '@/core/logging/logger';
import type { PrayerTimes } from '@/core/prayer-engine';

import type { AdhanSettings } from '../types';
import {
  buildScheduleRequests,
  buildSettingsFingerprint,
  type TranslateFn,
} from './adhanScheduler';

const ADHAN_ID_PREFIX = 'adhan-';

export class AdhanNotificationService {
  private static initialized = false;

  static async initialize(silentModeOverride: boolean): Promise<void> {
    if (this.initialized) return;
    configureForegroundHandler();
    await setupNotificationChannels(silentModeOverride);
    this.initialized = true;
    logger.info('Adhan notification service initialized');
  }

  static async requestPermissions(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === Notifications.PermissionStatus.GRANTED) {
      return true;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === Notifications.PermissionStatus.GRANTED;
  }

  static async cancelAllAdhanNotifications(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const adhanIds = scheduled
      .map((n) => n.identifier)
      .filter((id) => id.startsWith(ADHAN_ID_PREFIX));
    await Promise.all(adhanIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
    logger.info('Cancelled adhan notifications', { count: adhanIds.length });
  }

  static async reschedule(
    week: PrayerTimes[],
    settings: AdhanSettings,
    t: TranslateFn,
    options?: { force?: boolean; lastFingerprint?: string | null },
  ): Promise<{ scheduled: number; fingerprint: string }> {
    await this.initialize(settings.silentModeOverride);
    await setupNotificationChannels(settings.silentModeOverride);

    const fingerprint = buildSettingsFingerprint(settings, week);

    if (!options?.force && options?.lastFingerprint === fingerprint) {
      logger.debug('Adhan schedule unchanged, skipping reschedule');
      return { scheduled: 0, fingerprint };
    }

    if (!settings.masterEnabled) {
      await this.cancelAllAdhanNotifications();
      return { scheduled: 0, fingerprint };
    }

    const granted = await this.requestPermissions();
    if (!granted) {
      logger.warn('Adhan reschedule skipped — notification permission denied');
      return { scheduled: 0, fingerprint };
    }

    await this.cancelAllAdhanNotifications();

    const requests = buildScheduleRequests(week, settings, t);
    let scheduled = 0;

    for (const request of requests) {
      try {
        await Notifications.scheduleNotificationAsync(request);
        scheduled += 1;
      } catch (error) {
        logger.error('Failed to schedule adhan notification', error, {
          id: request.identifier,
        });
      }
    }

    logger.info('Adhan notifications scheduled', { scheduled, fingerprint });
    return { scheduled, fingerprint };
  }

  static async getScheduledCount(): Promise<number> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    return all.filter((n) => n.identifier.startsWith(ADHAN_ID_PREFIX)).length;
  }
}

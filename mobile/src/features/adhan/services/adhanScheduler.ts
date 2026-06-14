import { Platform } from 'react-native';

import type { PrayerName, PrayerTimes } from '@/core/prayer-engine';
import type { ScheduledNotificationRequest } from '@/core/native/notifications';

import { getAdhanVoice, resolveVoiceForPrayer } from '../data/adhanVoices';
import { pickAdhanSettings, snapshotAdhanSettingsForFingerprint, type AdhanSettings, type AdhanVoiceId, type NotificationKind } from '../types';
import { ADHAN_CHANNEL_ID, REMINDER_CHANNEL_ID } from './notificationChannels';

/** iOS caps local notifications — schedule 3 days ahead and refresh on app open. */
export const SCHEDULE_DAYS = 3;

export function buildNotificationId(
  dateKey: string,
  prayer: PrayerName,
  kind: NotificationKind,
): string {
  return `adhan-${dateKey}-${prayer}-${kind}`;
}

export function dateKeyFromDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60_000);
}

export interface NotificationCopy {
  title: string;
  body: string;
}

export type TranslateFn = (key: string, opts?: Record<string, string | number>) => string;

export function getNotificationCopy(
  prayer: PrayerName,
  kind: NotificationKind,
  t: TranslateFn,
): NotificationCopy {
  const prayerLabel = t(`prayer.${prayer}`);

  if (kind === 'adhan') {
    return {
      title: t('adhan.notifications.adhanTitle', { prayer: prayerLabel }),
      body: t('adhan.notifications.adhanBody', { prayer: prayerLabel }),
    };
  }
  if (kind === 'preparation') {
    return {
      title: t('adhan.notifications.prepTitle', { prayer: prayerLabel }),
      body: t('adhan.notifications.prepBody', { prayer: prayerLabel }),
    };
  }
  return {
    title: t('adhan.notifications.smartTitle', { prayer: prayerLabel }),
    body: t('adhan.notifications.smartBody', { prayer: prayerLabel }),
  };
}

export function resolveSound(
  settings: AdhanSettings,
  prayer: PrayerName,
  kind: NotificationKind,
): string | boolean {
  const prefs = settings.prayers[prayer];

  if (prefs.customSoundUri && kind === 'adhan') {
    return prefs.customSoundUri;
  }

  if (kind !== 'adhan') {
    return 'default';
  }

  const voice = resolveVoiceForPrayer(settings.globalVoiceId, prefs.voiceId);
  if (voice.soundIos === 'default' && voice.soundAndroid === 'default') {
    return 'default';
  }

  return Platform.OS === 'ios' ? voice.soundIos : voice.soundAndroid;
}

export function buildScheduleRequests(
  week: PrayerTimes[],
  settings: AdhanSettings,
  t: TranslateFn,
  now: Date = new Date(),
): ScheduledNotificationRequest[] {
  if (!settings.masterEnabled) return [];

  const requests: ScheduledNotificationRequest[] = [];
  const daysToSchedule = week.slice(0, SCHEDULE_DAYS);
  const nowMs = now.getTime();

  for (const dayTimes of daysToSchedule) {
    const dayKey = dateKeyFromDate(dayTimes.date);

    for (const prayer of (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[])) {
      const prefs = settings.prayers[prayer];
      if (!prefs.enabled) continue;

      const prayerTime = dayTimes[prayer];
      const sound = resolveSound(settings, prayer, 'adhan');

      if (prayerTime.getTime() > nowMs) {
        const copy = getNotificationCopy(prayer, 'adhan', t);
        requests.push(
          buildRequest({
            id: buildNotificationId(dayKey, prayer, 'adhan'),
            triggerDate: prayerTime,
            copy,
            sound,
            channelId: ADHAN_CHANNEL_ID,
            silentOverride: settings.silentModeOverride,
            data: { prayer, kind: 'adhan', dayKey },
          }),
        );
      }

      if (settings.preparationMinutes > 0) {
        const prepTime = subtractMinutes(prayerTime, settings.preparationMinutes);
        if (prepTime.getTime() > nowMs) {
          const copy = getNotificationCopy(prayer, 'preparation', t);
          requests.push(
            buildRequest({
              id: buildNotificationId(dayKey, prayer, 'preparation'),
              triggerDate: prepTime,
              copy,
              sound: 'default',
              channelId: REMINDER_CHANNEL_ID,
              silentOverride: settings.silentModeOverride,
              data: {
                prayer,
                kind: 'preparation',
                dayKey,
                minutes: settings.preparationMinutes,
              },
            }),
          );
        }
      }

      if (settings.smartRemindersEnabled && settings.smartReminderMinutes > 0) {
        const smartTime = subtractMinutes(prayerTime, settings.smartReminderMinutes);
        if (smartTime.getTime() > nowMs) {
          const copy = getNotificationCopy(prayer, 'smart', t);
          requests.push(
            buildRequest({
              id: buildNotificationId(dayKey, prayer, 'smart'),
              triggerDate: smartTime,
              copy,
              sound: 'default',
              channelId: REMINDER_CHANNEL_ID,
              silentOverride: false,
              data: {
                prayer,
                kind: 'smart',
                dayKey,
                minutes: settings.smartReminderMinutes,
              },
            }),
          );
        }
      }
    }
  }

  return requests;
}

function buildRequest(opts: {
  id: string;
  triggerDate: Date;
  copy: NotificationCopy;
  sound: string | boolean;
  channelId: string;
  silentOverride: boolean;
  data: Record<string, unknown>;
}): ScheduledNotificationRequest {
  return {
    identifier: opts.id,
    triggerDate: opts.triggerDate,
    content: {
      title: opts.copy.title,
      body: opts.copy.body,
      sound: opts.sound,
      data: opts.data,
      channelId: opts.channelId,
      priority: 'max',
      interruptionLevel: opts.silentOverride ? 'timeSensitive' : 'active',
    },
  };
}

export function buildSettingsFingerprint(
  settings: AdhanSettings,
  week: PrayerTimes[],
): string {
  const slice = week.slice(0, SCHEDULE_DAYS);
  const timesPart = slice
    .map((d) =>
      (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[])
        .map((p) => d[p].getTime())
        .join(','),
    )
    .join('|');
  return JSON.stringify({ settings: snapshotAdhanSettingsForFingerprint(settings), timesPart });
}

/** Preview voice label for settings UI. */
export function getVoiceLabel(voiceId: AdhanVoiceId, t: TranslateFn): string {
  return t(getAdhanVoice(voiceId).labelKey);
}

import notifee, { EventType, type Event } from '@notifee/react-native';
import { AppState } from 'react-native';

import { scheduleNotificationAsync } from '@/core/native/notifications';
import { logger } from '@/core/logging/logger';
import { navigateFromNotification } from '@/navigation/navigationRef';
import type { RootStackParamList } from '@/navigation/types';

import { useForegroundNotificationStore } from './foregroundNotificationStore';
import {
  trackNotificationDelivered,
  trackNotificationOpened,
  trackNotificationSnoozed,
} from './notificationAnalytics';

const SNOOZE_MINUTES = 10;

function normalizeData(raw: Record<string, unknown> | undefined): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value == null) continue;
    out[key] = typeof value === 'string' ? value : String(value);
  }
  return out;
}

function parseRouteParams(raw: string | undefined): Record<string, string> | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return undefined;
  }
}

export function navigateFromNotificationData(data: Record<string, string>): void {
  const route = data.route as keyof RootStackParamList | undefined;
  if (!route) return;

  const routeParams = parseRouteParams(data.routeParams);
  if (route === 'QuranReader' && data.surah) {
    navigateFromNotification('QuranReader', {
      surahNumber: Number(data.surah),
      ayah: data.ayah ? Number(data.ayah) : undefined,
    });
    return;
  }
  if (route === 'DuaReader' && data.duaId) {
    navigateFromNotification('DuaReader', { duaId: data.duaId });
    return;
  }
  if (route === 'HadithDetail' && data.hadithId) {
    navigateFromNotification('HadithDetail', { hadithId: data.hadithId });
    return;
  }

  navigateFromNotification(route, routeParams as RootStackParamList[typeof route]);
}

async function handleSnooze(
  data: Record<string, string>,
  notification: Event['detail']['notification'],
): Promise<void> {
  if (!notification?.title || !notification.body) return;

  const snoozeAt = new Date(Date.now() + SNOOZE_MINUTES * 60_000);
  const snoozeId = `snooze-${notification.id ?? Date.now()}`;

  await scheduleNotificationAsync({
    identifier: snoozeId,
    triggerDate: snoozeAt,
    content: {
      title: notification.title,
      body: notification.body,
      sound: 'default',
      channelId: data.channelId ?? undefined,
      data: { ...data, snoozedFrom: notification.id ?? '' },
    },
  });

  trackNotificationSnoozed({ ...data, minutes: String(SNOOZE_MINUTES) });
  logger.info('Notification snoozed', { snoozeId, minutes: SNOOZE_MINUTES });
}

export async function handleNotificationEvent(event: Event): Promise<void> {
  const { type, detail } = event;
  const data = normalizeData(detail.notification?.data as Record<string, unknown> | undefined);
  data.notificationId = detail.notification?.id ?? data.notificationId ?? '';

  if (type === EventType.DELIVERED) {
    trackNotificationDelivered(data);
    if (AppState.currentState === 'active' && detail.notification) {
      useForegroundNotificationStore.getState().show({
        id: detail.notification.id ?? String(Date.now()),
        title: detail.notification.title ?? '',
        body: detail.notification.body ?? '',
        category: data.category,
        data,
      });
    }
    return;
  }

  if (type === EventType.PRESS) {
    trackNotificationOpened(data);
    navigateFromNotificationData(data);
    return;
  }

  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'snooze_10') {
    await handleSnooze(data, detail.notification);
  }
}

export function registerNotificationEventHandlers(): void {
  notifee.onForegroundEvent((event) => {
    void handleNotificationEvent(event);
  });
}

export async function handleBackgroundNotificationEvent(event: Event): Promise<void> {
  await handleNotificationEvent(event);
}

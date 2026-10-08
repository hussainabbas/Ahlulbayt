import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';

import { logger } from '@/core/logging/logger';

export const ADHAN_CHANNEL_ID = 'adhan-primary';
export const REMINDER_CHANNEL_ID = 'adhan-reminder';
export const ADHAN_SILENT_CHANNEL_ID = 'adhan-silent';

export interface NotificationActionInput {
  id: string;
  title: string;
}

export interface NotificationContentInput {
  title: string;
  body: string;
  sound?: string | boolean;
  data?: Record<string, unknown>;
  channelId?: string;
  priority?: 'max' | 'high' | 'default';
  interruptionLevel?: 'timeSensitive' | 'active';
  vibration?: boolean;
  actions?: NotificationActionInput[];
}

export interface ScheduledNotificationRequest {
  identifier: string;
  content: NotificationContentInput;
  triggerDate: Date;
}

export const PermissionStatus = {
  GRANTED: 'granted' as const,
  DENIED: 'denied' as const,
};

export async function setupNotificationChannels(silentModeOverride: boolean): Promise<void> {
  if (Platform.OS === 'ios') {
    await notifee.setNotificationCategories([
      {
        id: 'PRAYER_ACTIONS',
        actions: [{ id: 'snooze_10', title: 'Snooze' }],
      },
    ]);
    return;
  }

  await notifee.createChannel({
    id: ADHAN_CHANNEL_ID,
    name: 'Adhan',
    description: 'Prayer time adhan calls',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    bypassDnd: silentModeOverride,
    visibility: AndroidVisibility.PUBLIC,
  });

  await notifee.createChannel({
    id: ADHAN_SILENT_CHANNEL_ID,
    name: 'Silent Prayer Reminders',
    description: 'Prayer alerts without adhan sound',
    importance: AndroidImportance.HIGH,
    sound: undefined,
    vibration: true,
    bypassDnd: silentModeOverride,
  });

  await notifee.createChannel({
    id: REMINDER_CHANNEL_ID,
    name: 'Prayer Reminders',
    description: 'Preparation and smart prayer reminders',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    bypassDnd: silentModeOverride,
  });

  logger.info('Adhan notification channels configured', { silentModeOverride });
}

/** Legacy hook — event routing lives in notificationRouter. */
export function configureForegroundHandler(): void {
  notifee.onForegroundEvent(({ type }) => {
    if (type === EventType.DELIVERED || type === EventType.PRESS) {
      // Handled by registerNotificationEventHandlers().
    }
  });
}

export async function getPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }> {
  const settings = await notifee.getNotificationSettings();
  const granted =
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
  return { status: granted ? 'granted' : 'denied' };
}

export async function requestPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }> {
  const settings = await notifee.requestPermission();
  const granted =
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
  return { status: granted ? 'granted' : 'denied' };
}

export async function scheduleNotificationAsync(
  request: ScheduledNotificationRequest,
): Promise<string> {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: request.triggerDate.getTime(),
  };

  const useSilentChannel = request.content.sound === false;
  const androidSound =
    typeof request.content.sound === 'string'
      ? request.content.sound
      : request.content.sound === false
        ? undefined
        : 'default';

  return notifee.createTriggerNotification(
    {
      id: request.identifier,
      title: request.content.title,
      body: request.content.body,
      data: request.content.data as Record<string, string> | undefined,
      android: {
        channelId:
          request.content.channelId ??
          (useSilentChannel ? ADHAN_SILENT_CHANNEL_ID : ADHAN_CHANNEL_ID),
        sound: androidSound,
        vibrationPattern: request.content.vibration === false ? undefined : [300, 500, 300, 500],
        pressAction: { id: 'default' },
        actions: request.content.actions?.map((action) => ({
          title: action.title,
          pressAction: { id: action.id },
        })),
        importance: AndroidImportance.HIGH,
      },
      ios: {
        sound:
          typeof request.content.sound === 'string'
            ? request.content.sound
            : request.content.sound === false
              ? undefined
              : 'default',
        interruptionLevel: request.content.interruptionLevel ?? 'active',
        ...(request.content.actions?.length ? { categoryId: 'PRAYER_ACTIONS' } : {}),
      },
    },
    trigger,
  );
}

export async function cancelScheduledNotificationAsync(id: string): Promise<void> {
  await notifee.cancelTriggerNotification(id);
}

export async function getAllScheduledNotificationsAsync(): Promise<
  Array<{ identifier: string }>
> {
  const ids = (await notifee.getTriggerNotificationIds()) ?? [];
  return ids.map((identifier) => ({ identifier }));
}

/** Compatibility namespace matching prior expo-notifications usage. */
export const Notifications = {
  PermissionStatus,
  AndroidImportance: { MAX: 'max', HIGH: 'high' },
  AndroidNotificationPriority: { MAX: 'max' },
  AndroidVisibility: { PUBLIC: 'public' },
  setNotificationChannelAsync: async (
    id: string,
    channel: { name: string; bypassDnd?: boolean },
  ) => {
    await notifee.createChannel({
      id,
      name: channel.name,
      importance: AndroidImportance.HIGH,
      bypassDnd: channel.bypassDnd,
    });
  },
  setNotificationHandler: configureForegroundHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
};

export { notifee };

import { Platform } from 'react-native';

import notifee from '@notifee/react-native';

import { logger } from '@/core/logging/logger';

type MessagingModule = typeof import('@react-native-firebase/messaging').default;

let messagingModule: MessagingModule | null | undefined;

function getMessaging(): MessagingModule | null {
  if (messagingModule !== undefined) return messagingModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    messagingModule = require('@react-native-firebase/messaging').default as MessagingModule;
  } catch {
    messagingModule = null;
    logger.warn('Firebase Messaging not installed — remote push disabled');
  }
  return messagingModule;
}

async function displayRemoteMessage(
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<void> {
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: data.channelId ?? 'smart-ai',
      pressAction: { id: 'default' },
    },
  });
}

async function registerFcmBackgroundHandler(): Promise<void> {
  const messaging = getMessaging();
  if (!messaging) return;

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const title = remoteMessage.notification?.title ?? 'AhlulBayt+';
    const body = remoteMessage.notification?.body ?? '';
    const data = (remoteMessage.data ?? {}) as Record<string, string>;
    await displayRemoteMessage(title, body, data);
  });
}

export async function initializeFcm(): Promise<string | null> {
  const messaging = getMessaging();
  if (!messaging) return null;

  try {
    await registerFcmBackgroundHandler();

    if (Platform.OS === 'ios') {
      await messaging().requestPermission();
    }

    const token = await messaging().getToken();
    logger.info('FCM token registered', { platform: Platform.OS });

    messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title ?? 'AhlulBayt+';
      const body = remoteMessage.notification?.body ?? '';
      const data = (remoteMessage.data ?? {}) as Record<string, string>;
      await displayRemoteMessage(title, body, data);
    });

    return token;
  } catch (error) {
    logger.warn('FCM initialization failed', error);
    return null;
  }
}

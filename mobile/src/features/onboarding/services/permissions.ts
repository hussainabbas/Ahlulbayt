import { Location } from '@/core/native/location';
import { Notifications } from '@/core/native/notifications';

import { logger } from '@/core/logging/logger';

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Location.getForegroundPermissionsAsync();
    if (existing === Location.PermissionStatus.GRANTED) {
      return true;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (error) {
    logger.error('Location permission request failed', error);
    return false;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === Notifications.PermissionStatus.GRANTED) {
      return true;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === Notifications.PermissionStatus.GRANTED;
  } catch (error) {
    logger.error('Notification permission request failed', error);
    return false;
  }
}

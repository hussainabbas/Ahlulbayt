import {
  AppState,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { logger } from '@/core/logging/logger';

import type { Coordinates } from '@/core/prayer-engine';

export type LocationPermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

export const LocationPermission = {
  GRANTED: 'granted' as LocationPermissionStatus,
  DENIED: 'denied' as LocationPermissionStatus,
};

function isActivityNotReadyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('not attached to an Activity');
}

function waitForAppActive(): Promise<void> {
  if (AppState.currentState === 'active') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        subscription.remove();
        resolve();
      }
    });
  });
}

async function waitForAndroidActivityReady(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await waitForAppActive();
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function requestAndroidLocationPermission(): Promise<boolean> {
  await waitForAndroidActivityReady();

  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'AhlulBayt+ uses your location to calculate accurate Jafari prayer times and qibla direction.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      if (isActivityNotReadyError(error) && attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
        await waitForAndroidActivityReady();
        continue;
      }
      throw error;
    }
  }
  return false;
}

export async function getForegroundPermissionsAsync(): Promise<{
  status: LocationPermissionStatus;
}> {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return { status: status === 'granted' ? 'granted' : 'denied' };
  }
  const granted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return { status: granted ? 'granted' : 'denied' };
}

export async function requestForegroundPermissionsAsync(): Promise<{
  status: LocationPermissionStatus;
}> {
  try {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return { status: status === 'granted' ? 'granted' : 'denied' };
    }

    const existing = await getForegroundPermissionsAsync();
    if (existing.status === 'granted') {
      return existing;
    }

    const granted = await requestAndroidLocationPermission();
    return { status: granted ? 'granted' : 'denied' };
  } catch (error) {
    if (isActivityNotReadyError(error)) {
      logger.warn('Location permission deferred — Android Activity not ready yet');
      return { status: 'denied' };
    }
    logger.error('Location permission request failed', error);
    return { status: 'denied' };
  }
}

export async function getCurrentPositionAsync(): Promise<{
  coords: Coordinates;
}> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
}

export async function reverseGeocodeAsync(
  coords: Coordinates,
): Promise<Array<{ city?: string; subregion?: string; region?: string }>> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AhlulBaytPlus/1.0' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      address?: { city?: string; town?: string; village?: string; state?: string; county?: string };
    };
    const city =
      data.address?.city ?? data.address?.town ?? data.address?.village ?? undefined;
    const region = data.address?.state ?? data.address?.county ?? undefined;
    return [{ city, subregion: region, region }];
  } catch {
    return [];
  }
}

/** Compatibility namespace matching prior expo-location usage. */
export const Location = {
  PermissionStatus: LocationPermission,
  Accuracy: { Balanced: 3 },
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
};

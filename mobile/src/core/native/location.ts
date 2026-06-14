import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { logger } from '@/core/logging/logger';

import type { Coordinates } from '@/core/prayer-engine';

export type LocationPermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

export const LocationPermission = {
  GRANTED: 'granted' as LocationPermissionStatus,
  DENIED: 'denied' as LocationPermissionStatus,
};

async function requestAndroidLocationPermission(): Promise<boolean> {
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
    const granted = await requestAndroidLocationPermission();
    return { status: granted ? 'granted' : 'denied' };
  } catch (error) {
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

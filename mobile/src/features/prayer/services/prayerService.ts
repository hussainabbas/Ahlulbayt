import { Location } from '@/core/native/location';

import {
  batchCalculatePrayerTimes,
  calculatePrayerTimes,
  type Coordinates,
  type PrayerConfig,
  type PrayerTimes,
} from '@/core/prayer-engine';
import { useLocationStore, DEFAULT_COORDS } from '@/stores/locationStore';

const LOCATION_REFRESH_DISTANCE_M = 5000;

function haversineMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export class PrayerService {
  /** Fetch GPS coordinates and update location store if moved > 5 km. */
  static async refreshLocationFromGps(): Promise<Coordinates> {
    const store = useLocationStore.getState();
    const previous: Coordinates = {
      latitude: store.latitude,
      longitude: store.longitude,
    };

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return previous;
    }

    const pos = await Location.getCurrentPositionAsync();

    const next: Coordinates = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    const moved = haversineMeters(previous, next);
    if (moved > LOCATION_REFRESH_DISTANCE_M || store.cityName == null) {
      try {
        const [geo] = await Location.reverseGeocodeAsync(next);
        const city = geo?.city ?? geo?.subregion ?? geo?.region ?? null;
        store.setLocation(next.latitude, next.longitude, city);
      } catch {
        store.setLocation(next.latitude, next.longitude);
      }
    }

    return next;
  }

  static getCoordinates(): Coordinates {
    const { latitude, longitude } = useLocationStore.getState();
    const lat = Number.isFinite(latitude) ? latitude : DEFAULT_COORDS.latitude;
    const lng = Number.isFinite(longitude) ? longitude : DEFAULT_COORDS.longitude;
    return { latitude: lat, longitude: lng };
  }

  static calculateToday(config: PrayerConfig, date = new Date()): PrayerTimes {
    return calculatePrayerTimes(date, this.getCoordinates(), config);
  }

  static calculateRange(
    config: PrayerConfig,
    days: number,
    startDate = new Date(),
  ): PrayerTimes[] {
    return batchCalculatePrayerTimes(startDate, days, this.getCoordinates(), config);
  }
}

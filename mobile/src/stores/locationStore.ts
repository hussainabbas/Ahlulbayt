import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

/** Default: Makkah — used when location permission is not granted. */
export const DEFAULT_COORDS = { latitude: 21.4225, longitude: 39.8262, cityName: 'Makkah' };

interface LocationState {
  latitude: number;
  longitude: number;
  cityName: string | null;
  setLocation: (latitude: number, longitude: number, cityName?: string | null) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      latitude: DEFAULT_COORDS.latitude,
      longitude: DEFAULT_COORDS.longitude,
      cityName: DEFAULT_COORDS.cityName,
      setLocation: (latitude, longitude, cityName = null) =>
        set({ latitude, longitude, cityName }),
    }),
    {
      name: 'ahlulbayt-location',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

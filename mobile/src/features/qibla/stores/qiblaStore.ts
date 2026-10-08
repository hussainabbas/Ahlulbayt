import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { QiblaViewMode } from '../types';

interface QiblaState {
  headingOffset: number;
  lastQiblaBearing: number | null;
  lastDistanceKm: number | null;
  preferredView: QiblaViewMode;
  calibrationCompletedAt: string | null;
  setHeadingOffset: (offset: number) => void;
  adjustHeadingOffset: (delta: number) => void;
  resetCalibration: () => void;
  setLastQibla: (bearing: number, distanceKm: number) => void;
  setPreferredView: (view: QiblaViewMode) => void;
  markCalibrated: () => void;
}

export const useQiblaStore = create<QiblaState>()(
  persist(
    (set) => ({
      headingOffset: 0,
      lastQiblaBearing: null,
      lastDistanceKm: null,
      preferredView: 'compass',
      calibrationCompletedAt: null,
      setHeadingOffset: (headingOffset) => set({ headingOffset }),
      adjustHeadingOffset: (delta) =>
        set((s) => ({ headingOffset: s.headingOffset + delta })),
      resetCalibration: () =>
        set({ headingOffset: 0, calibrationCompletedAt: null }),
      setLastQibla: (bearing, distanceKm) =>
        set({ lastQiblaBearing: bearing, lastDistanceKm: distanceKm }),
      setPreferredView: (preferredView) => set({ preferredView }),
      markCalibrated: () =>
        set({ calibrationCompletedAt: new Date().toISOString() }),
    }),
    {
      name: 'ahlulbayt-qibla',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

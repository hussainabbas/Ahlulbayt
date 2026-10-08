import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createDefaultConfig,
  getDeviceTimezone,
  PRAYER_METHODS,
  resolveMethodParams,
  type HighLatitudeRule,
  type ManualOffsets,
  type PrayerMethodId,
} from '@/core/prayer-engine';
import { mmkvStorage } from '@/core/storage/mmkv';

interface PrayerSettingsState {
  method: PrayerMethodId;
  highLatitudeRule: HighLatitudeRule;
  manualOffsets: ManualOffsets;
  timezone: string;
  setMethod: (method: PrayerMethodId) => void;
  setHighLatitudeRule: (rule: HighLatitudeRule) => void;
  setManualOffset: (prayer: keyof ManualOffsets, minutes: number) => void;
  clearManualOffsets: () => void;
  setTimezone: (timezone: string) => void;
  getConfig: () => ReturnType<typeof buildConfig>;
}

function buildConfig(state: {
  method: PrayerMethodId;
  highLatitudeRule: HighLatitudeRule;
  manualOffsets: ManualOffsets;
  timezone: string;
}) {
  const tz = state.timezone === 'auto' ? getDeviceTimezone() : state.timezone;
  return {
    ...createDefaultConfig(tz),
    method: state.method,
    methodParams: resolveMethodParams(state.method),
    highLatitudeRule: state.highLatitudeRule,
    manualOffsets: state.manualOffsets,
    timezone: state.timezone,
  };
}

export const usePrayerStore = create<PrayerSettingsState>()(
  persist(
    (set, get) => ({
      method: 'leva',
      highLatitudeRule: 'angle_based',
      manualOffsets: {},
      timezone: 'auto',
      setMethod: (method) => set({ method }),
      setHighLatitudeRule: (highLatitudeRule) => set({ highLatitudeRule }),
      setManualOffset: (prayer, minutes) =>
        set((s) => ({
          manualOffsets: { ...s.manualOffsets, [prayer]: minutes },
        })),
      clearManualOffsets: () => set({ manualOffsets: {} }),
      setTimezone: (timezone) => set({ timezone }),
      getConfig: () => buildConfig(get()),
    }),
    {
      name: 'ahlulbayt-prayer',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({
        method: s.method,
        highLatitudeRule: s.highLatitudeRule,
        manualOffsets: s.manualOffsets,
        timezone: s.timezone,
      }),
    },
  ),
);

export { PRAYER_METHODS };

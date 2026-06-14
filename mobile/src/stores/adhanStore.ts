import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PrayerName } from '@/core/prayer-engine';
import { mmkvStorage } from '@/core/storage/mmkv';

import {
  createDefaultAdhanSettings,
  type AdhanSettings,
  type AdhanVoiceId,
  type PrayerNotificationPrefs,
} from '@/features/adhan/types';

interface AdhanStoreState extends AdhanSettings {
  lastScheduledFingerprint: string | null;
  setMasterEnabled: (enabled: boolean) => void;
  setSilentModeOverride: (enabled: boolean) => void;
  setSmartRemindersEnabled: (enabled: boolean) => void;
  setSmartReminderMinutes: (minutes: number) => void;
  setPreparationMinutes: (minutes: number) => void;
  setGlobalVoice: (voiceId: AdhanVoiceId) => void;
  setPrayerEnabled: (prayer: PrayerName, enabled: boolean) => void;
  setPrayerVoice: (prayer: PrayerName, voiceId: AdhanVoiceId | undefined) => void;
  setPrayerCustomSound: (prayer: PrayerName, uri: string | null) => void;
  updatePrayerPrefs: (prayer: PrayerName, prefs: Partial<PrayerNotificationPrefs>) => void;
  setLastScheduledFingerprint: (fp: string | null) => void;
  resetToDefaults: () => void;
}

const defaults = createDefaultAdhanSettings();

export const useAdhanStore = create<AdhanStoreState>()(
  persist(
    (set) => ({
      ...defaults,
      lastScheduledFingerprint: null,
      setMasterEnabled: (masterEnabled) => set({ masterEnabled }),
      setSilentModeOverride: (silentModeOverride) => set({ silentModeOverride }),
      setSmartRemindersEnabled: (smartRemindersEnabled) => set({ smartRemindersEnabled }),
      setSmartReminderMinutes: (smartReminderMinutes) => set({ smartReminderMinutes }),
      setPreparationMinutes: (preparationMinutes) => set({ preparationMinutes }),
      setGlobalVoice: (globalVoiceId) => set({ globalVoiceId }),
      setPrayerEnabled: (prayer, enabled) =>
        set((s) => ({
          prayers: {
            ...s.prayers,
            [prayer]: { ...s.prayers[prayer], enabled },
          },
        })),
      setPrayerVoice: (prayer, voiceId) =>
        set((s) => ({
          prayers: {
            ...s.prayers,
            [prayer]: { ...s.prayers[prayer], voiceId },
          },
        })),
      setPrayerCustomSound: (prayer, customSoundUri) =>
        set((s) => ({
          prayers: {
            ...s.prayers,
            [prayer]: { ...s.prayers[prayer], customSoundUri },
          },
        })),
      updatePrayerPrefs: (prayer, prefs) =>
        set((s) => ({
          prayers: {
            ...s.prayers,
            [prayer]: { ...s.prayers[prayer], ...prefs },
          },
        })),
      setLastScheduledFingerprint: (lastScheduledFingerprint) => set({ lastScheduledFingerprint }),
      resetToDefaults: () => set({ ...createDefaultAdhanSettings(), lastScheduledFingerprint: null }),
    }),
    {
      name: 'ahlulbayt-adhan',
      storage: createJSONStorage(() => mmkvStorage),
      merge: (persisted, current) => {
        const saved = persisted as Partial<AdhanStoreState> | undefined;
        return {
          ...current,
          ...saved,
          prayers: {
            ...createDefaultAdhanSettings().prayers,
            ...(saved?.prayers ?? {}),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const fingerprint = state.lastScheduledFingerprint;
        if (typeof fingerprint === 'string' && fingerprint.length > 4096) {
          state.lastScheduledFingerprint = null;
        }

        if (!state.prayers) {
          state.prayers = createDefaultAdhanSettings().prayers;
        }
      },
    },
  ),
);

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { CategoryPreferences, NotificationCategory, NotificationPreferences } from '../types';

function defaultCategory(enabled = true): CategoryPreferences {
  return { enabled };
}

export function createDefaultNotificationPreferences(): NotificationPreferences {
  return {
    masterEnabled: true,
    quietHoursEnabled: true,
    quietStartHour: 23,
    quietEndHour: 5,
    categories: {
      prayer: defaultCategory(true),
      events: defaultCategory(true),
      duas: defaultCategory(true),
      muharram: defaultCategory(true),
      amaal: defaultCategory(true),
      fasting: defaultCategory(true),
    },
  };
}

interface NotificationPreferencesState extends NotificationPreferences {
  lastScheduledFingerprint: string | null;
  setMasterEnabled: (enabled: boolean) => void;
  setCategoryEnabled: (category: NotificationCategory, enabled: boolean) => void;
  setQuietHours: (enabled: boolean, start?: number, end?: number) => void;
  setCategoryHours: (
    category: NotificationCategory,
    hours: Partial<Pick<CategoryPreferences, 'digestHour' | 'eveningHour'>>,
  ) => void;
  setLastFingerprint: (fp: string | null) => void;
  resetToDefaults: () => void;
}

const defaults = createDefaultNotificationPreferences();

export function pickNotificationPreferences(
  source: NotificationPreferences & { lastScheduledFingerprint?: string | null },
): NotificationPreferences {
  const fallback = createDefaultNotificationPreferences();
  return {
    masterEnabled: source.masterEnabled ?? fallback.masterEnabled,
    quietHoursEnabled: source.quietHoursEnabled ?? fallback.quietHoursEnabled,
    quietStartHour: source.quietStartHour ?? fallback.quietStartHour,
    quietEndHour: source.quietEndHour ?? fallback.quietEndHour,
    categories: {
      ...fallback.categories,
      ...(source.categories ?? {}),
    },
  };
}

const MAX_FINGERPRINT_LENGTH = 4096;

export const useNotificationPreferencesStore = create<NotificationPreferencesState>()(
  persist(
    (set) => ({
      ...defaults,
      lastScheduledFingerprint: null,
      setMasterEnabled: (masterEnabled) => set({ masterEnabled }),
      setCategoryEnabled: (category, enabled) =>
        set((s) => ({
          categories: {
            ...s.categories,
            [category]: { ...s.categories[category], enabled },
          },
        })),
      setQuietHours: (quietHoursEnabled, quietStartHour, quietEndHour) =>
        set((s) => ({
          quietHoursEnabled,
          quietStartHour: quietStartHour ?? s.quietStartHour,
          quietEndHour: quietEndHour ?? s.quietEndHour,
        })),
      setCategoryHours: (category, hours) =>
        set((s) => ({
          categories: {
            ...s.categories,
            [category]: { ...s.categories[category], ...hours },
          },
        })),
      setLastFingerprint: (lastScheduledFingerprint) => set({ lastScheduledFingerprint }),
      resetToDefaults: () =>
        set({ ...createDefaultNotificationPreferences(), lastScheduledFingerprint: null }),
    }),
    {
      name: 'ahlulbayt-notification-prefs',
      storage: createJSONStorage(() => mmkvStorage),
      merge: (persisted, current) => {
        const saved = persisted as Partial<NotificationPreferencesState> | undefined;
        const defaults = createDefaultNotificationPreferences();
        return {
          ...current,
          ...saved,
          categories: {
            ...defaults.categories,
            ...(saved?.categories ?? {}),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const fingerprint = state.lastScheduledFingerprint;
        if (typeof fingerprint === 'string' && fingerprint.length > MAX_FINGERPRINT_LENGTH) {
          state.lastScheduledFingerprint = null;
        }

        if (!state.categories) {
          state.categories = createDefaultNotificationPreferences().categories;
        }
      },
    },
  ),
);

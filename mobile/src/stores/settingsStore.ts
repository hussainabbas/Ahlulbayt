import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SupportedLocale, ThemeMode } from '@/core/config/constants';
import type { AiTopicOption, InterestOption, MarjaOption } from '@/features/onboarding/types';
import { getInitialLocale } from '@/i18n';
import { mmkvStorage } from '@/core/storage/mmkv';

interface SettingsState {
  locale: SupportedLocale;
  themeMode: ThemeMode;
  analyticsEnabled: boolean;
  marja: MarjaOption;
  interests: InterestOption[];
  aiEnabled: boolean;
  aiTopics: AiTopicOption[];
  setLocale: (locale: SupportedLocale) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setAnalyticsEnabled: (enabled: boolean) => void;
  setMarja: (marja: MarjaOption) => void;
  setInterests: (interests: InterestOption[]) => void;
  setAiPreferences: (enabled: boolean, topics: AiTopicOption[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      themeMode: 'system',
      analyticsEnabled: true,
      marja: 'sistani',
      interests: [],
      aiEnabled: true,
      aiTopics: ['daily_guidance', 'quran_reflection'],
      setLocale: (locale) => set({ locale }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
      setMarja: (marja) => set({ marja }),
      setInterests: (interests) => set({ interests }),
      setAiPreferences: (aiEnabled, aiTopics) => set({ aiEnabled, aiTopics }),
    }),
    {
      name: 'ahlulbayt-settings',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        locale: state.locale,
        themeMode: state.themeMode,
        analyticsEnabled: state.analyticsEnabled,
        marja: state.marja,
        interests: state.interests,
        aiEnabled: state.aiEnabled,
        aiTopics: state.aiTopics,
      }),
    },
  ),
);

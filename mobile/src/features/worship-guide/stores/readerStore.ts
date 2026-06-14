import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { GuideLearningMode, WorshipGuideReaderPrefs } from '../types';

interface WorshipGuideReaderState extends WorshipGuideReaderPrefs {
  setDefaultMode: (mode: GuideLearningMode) => void;
  setGuidedModeDefault: (enabled: boolean) => void;
  setShowArabic: (show: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const useWorshipGuideReaderStore = create<WorshipGuideReaderState>()(
  persist(
    (set) => ({
      defaultMode: 'beginner',
      guidedModeDefault: true,
      showArabic: true,
      showTransliteration: true,
      hapticsEnabled: true,
      autoPreloadAudio: true,
      setDefaultMode: (defaultMode) => set({ defaultMode }),
      setGuidedModeDefault: (guidedModeDefault) => set({ guidedModeDefault }),
      setShowArabic: (showArabic) => set({ showArabic }),
      setShowTransliteration: (showTransliteration) => set({ showTransliteration }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'ahlulbayt-worship-guide-reader',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

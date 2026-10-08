import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { GuideLearningMode, WorshipGuideReaderPrefs } from '../types';

import type { GuideContentLocale } from '@/components/guided/types';

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.5;
const FONT_SCALE_STEP = 0.08;

function clampFontScale(scale: number): number {
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, scale));
}

interface WorshipGuideReaderState extends WorshipGuideReaderPrefs {
  setDefaultMode: (mode: GuideLearningMode) => void;
  setGuidedModeDefault: (enabled: boolean) => void;
  setShowArabic: (show: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setContentLocale: (locale: GuideContentLocale) => void;
  setFontScale: (scale: number) => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
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
      contentLocale: 'en',
      fontScale: 1,
      setDefaultMode: (defaultMode) => set({ defaultMode }),
      setGuidedModeDefault: (guidedModeDefault) => set({ guidedModeDefault }),
      setShowArabic: (showArabic) => set({ showArabic }),
      setShowTransliteration: (showTransliteration) => set({ showTransliteration }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setContentLocale: (contentLocale) => set({ contentLocale }),
      setFontScale: (fontScale) => set({ fontScale: clampFontScale(fontScale) }),
      increaseFontScale: () =>
        set((s) => ({ fontScale: clampFontScale(s.fontScale + FONT_SCALE_STEP) })),
      decreaseFontScale: () =>
        set((s) => ({ fontScale: clampFontScale(s.fontScale - FONT_SCALE_STEP) })),
    }),
    {
      name: 'ahlulbayt-worship-guide-reader',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

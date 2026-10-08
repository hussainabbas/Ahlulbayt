import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { GuideDifficulty, PrayerAcademyReaderPrefs } from '../types';

import type { GuideContentLocale } from '@/components/guided/types';

const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.5;
const FONT_SCALE_STEP = 0.08;

function clampFontScale(scale: number): number {
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, scale));
}

interface PrayerAcademyReaderState extends PrayerAcademyReaderPrefs {
  setDifficulty: (d: GuideDifficulty) => void;
  setGuidedModeDefault: (v: boolean) => void;
  toggleShowArabic: () => void;
  toggleShowTransliteration: () => void;
  toggleShowFiqhRefs: () => void;
  setContentLocale: (locale: GuideContentLocale) => void;
  setFontScale: (scale: number) => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
}

export const usePrayerAcademyReaderStore = create<PrayerAcademyReaderState>()(
  persist(
    (set) => ({
      defaultDifficulty: 'beginner',
      guidedModeDefault: true,
      showArabic: true,
      showTransliteration: true,
      showFiqhRefs: true,
      contentLocale: 'en',
      fontScale: 1,
      setDifficulty: (defaultDifficulty) => set({ defaultDifficulty }),
      setGuidedModeDefault: (guidedModeDefault) => set({ guidedModeDefault }),
      toggleShowArabic: () => set((s) => ({ showArabic: !s.showArabic })),
      toggleShowTransliteration: () => set((s) => ({ showTransliteration: !s.showTransliteration })),
      toggleShowFiqhRefs: () => set((s) => ({ showFiqhRefs: !s.showFiqhRefs })),
      setContentLocale: (contentLocale) => set({ contentLocale }),
      setFontScale: (fontScale) => set({ fontScale: clampFontScale(fontScale) }),
      increaseFontScale: () =>
        set((s) => ({ fontScale: clampFontScale(s.fontScale + FONT_SCALE_STEP) })),
      decreaseFontScale: () =>
        set((s) => ({ fontScale: clampFontScale(s.fontScale - FONT_SCALE_STEP) })),
    }),
    {
      name: 'ahlulbayt-prayer-academy-reader',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

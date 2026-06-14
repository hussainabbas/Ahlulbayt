import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { GuideDifficulty, PrayerAcademyReaderPrefs } from '../types';

interface PrayerAcademyReaderState extends PrayerAcademyReaderPrefs {
  setDifficulty: (d: GuideDifficulty) => void;
  setGuidedModeDefault: (v: boolean) => void;
  toggleShowArabic: () => void;
  toggleShowTransliteration: () => void;
  toggleShowFiqhRefs: () => void;
}

export const usePrayerAcademyReaderStore = create<PrayerAcademyReaderState>()(
  persist(
    (set) => ({
      defaultDifficulty: 'beginner',
      guidedModeDefault: true,
      showArabic: true,
      showTransliteration: true,
      showFiqhRefs: true,
      setDifficulty: (defaultDifficulty) => set({ defaultDifficulty }),
      setGuidedModeDefault: (guidedModeDefault) => set({ guidedModeDefault }),
      toggleShowArabic: () => set((s) => ({ showArabic: !s.showArabic })),
      toggleShowTransliteration: () => set((s) => ({ showTransliteration: !s.showTransliteration })),
      toggleShowFiqhRefs: () => set((s) => ({ showFiqhRefs: !s.showFiqhRefs })),
    }),
    {
      name: 'ahlulbayt-prayer-academy-reader',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

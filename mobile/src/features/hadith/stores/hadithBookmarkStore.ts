import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { HadithBookmark, HadithId } from '../types';

interface HadithBookmarkState {
  bookmarks: HadithBookmark[];
  isBookmarked: (hadithId: HadithId) => boolean;
  toggleBookmark: (hadithId: HadithId) => void;
}

export const useHadithBookmarkStore = create<HadithBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isBookmarked: (hadithId) => get().bookmarks.some((b) => b.hadithId === hadithId),
      toggleBookmark: (hadithId) => {
        const existing = get().bookmarks.find((b) => b.hadithId === hadithId);
        if (existing) {
          set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.hadithId !== hadithId) }));
        } else {
          const bookmark: HadithBookmark = {
            id: `${hadithId}-${Date.now()}`,
            hadithId,
            createdAt: new Date().toISOString(),
          };
          set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
        }
      },
    }),
    { name: 'ahlulbayt-hadith-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

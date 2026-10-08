import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import { toAyahRef, type AyahRef, type QuranBookmark } from '../types';

interface BookmarkState {
  bookmarks: QuranBookmark[];
  addBookmark: (surah: number, ayah: number, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (surah: number, ayah: number) => boolean;
  toggleBookmark: (surah: number, ayah: number, label?: string) => void;
}

export const useQuranBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (surah, ayah, label) => {
        const ref = toAyahRef(surah, ayah);
        if (get().bookmarks.some((b) => b.ref === ref)) return;
        const bookmark: QuranBookmark = {
          id: `${ref}-${Date.now()}`,
          ref,
          surah,
          ayah,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (surah, ayah) =>
        get().bookmarks.some((b) => b.ref === toAyahRef(surah, ayah)),
      toggleBookmark: (surah, ayah, label) => {
        const ref = toAyahRef(surah, ayah);
        const existing = get().bookmarks.find((b) => b.ref === ref);
        if (existing) {
          get().removeBookmark(existing.id);
        } else {
          get().addBookmark(surah, ayah, label);
        }
      },
    }),
    { name: 'ahlulbayt-quran-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

export type { AyahRef };

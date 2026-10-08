import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { SahifaBookmark, SahifaId } from '../types';

interface SahifaBookmarkState {
  bookmarks: SahifaBookmark[];
  addBookmark: (sahifaId: SahifaId, sectionId?: string, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (sahifaId: SahifaId) => boolean;
  toggleBookmark: (sahifaId: SahifaId, label?: string) => void;
  getBookmarksFor: (sahifaId: SahifaId) => SahifaBookmark[];
}

export const useSahifaBookmarkStore = create<SahifaBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (sahifaId, sectionId, label) => {
        if (get().bookmarks.some((b) => b.sahifaId === sahifaId && b.sectionId === sectionId)) return;
        const bookmark: SahifaBookmark = {
          id: `${sahifaId}-${sectionId ?? 'full'}-${Date.now()}`,
          sahifaId,
          sectionId,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (sahifaId) => get().bookmarks.some((b) => b.sahifaId === sahifaId && !b.sectionId),
      toggleBookmark: (sahifaId, label) => {
        const existing = get().bookmarks.find((b) => b.sahifaId === sahifaId && !b.sectionId);
        if (existing) {
          get().removeBookmark(existing.id);
        } else {
          get().addBookmark(sahifaId, undefined, label);
        }
      },
      getBookmarksFor: (sahifaId) => get().bookmarks.filter((b) => b.sahifaId === sahifaId),
    }),
    { name: 'ahlulbayt-sahifa-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

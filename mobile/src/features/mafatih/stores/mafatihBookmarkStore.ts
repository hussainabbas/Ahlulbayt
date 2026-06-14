import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { MafatihBookmark, MafatihRef } from '../types';

interface MafatihBookmarkState {
  bookmarks: MafatihBookmark[];
  addBookmark: (ref: MafatihRef, sectionId?: string, label?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (ref: MafatihRef) => boolean;
  toggleBookmark: (ref: MafatihRef, label?: string) => void;
  getBookmarkRefs: () => MafatihRef[];
}

export const useMafatihBookmarkStore = create<MafatihBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (ref, sectionId, label) => {
        if (get().bookmarks.some((b) => b.ref === ref && b.sectionId === sectionId)) return;
        const bookmark: MafatihBookmark = {
          id: `${ref}-${sectionId ?? 'full'}-${Date.now()}`,
          ref,
          sectionId,
          label,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookmarks: [bookmark, ...s.bookmarks] }));
      },
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (ref) => get().bookmarks.some((b) => b.ref === ref && !b.sectionId),
      toggleBookmark: (ref, label) => {
        const existing = get().bookmarks.find((b) => b.ref === ref && !b.sectionId);
        if (existing) get().removeBookmark(existing.id);
        else get().addBookmark(ref, undefined, label);
      },
      getBookmarkRefs: () => [
        ...new Set(get().bookmarks.filter((b) => !b.sectionId).map((b) => b.ref)),
      ],
    }),
    { name: 'ahlulbayt-mafatih-bookmarks', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

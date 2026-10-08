import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { PrayerAcademyBookmark, PrayerAcademyId } from '../types';

interface PrayerAcademyBookmarkState {
  bookmarks: PrayerAcademyBookmark[];
  toggleBookmark: (prayerId: PrayerAcademyId, stepId?: string, label?: string) => void;
  isBookmarked: (prayerId: PrayerAcademyId, stepId?: string) => boolean;
}

function bookmarkKey(prayerId: PrayerAcademyId, stepId?: string): string {
  return stepId ? `${prayerId}::${stepId}` : prayerId;
}

export const usePrayerAcademyBookmarkStore = create<PrayerAcademyBookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      toggleBookmark: (prayerId, stepId, label) => {
        const key = bookmarkKey(prayerId, stepId);
        const existing = get().bookmarks.find(
          (b) => bookmarkKey(b.prayerId, b.stepId) === key,
        );
        if (existing) {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== existing.id),
          }));
          return;
        }
        set((state) => ({
          bookmarks: [
            {
              id: `${key}-${Date.now()}`,
              prayerId,
              stepId,
              label,
              createdAt: new Date().toISOString(),
            },
            ...state.bookmarks,
          ],
        }));
      },
      isBookmarked: (prayerId, stepId) => {
        const key = bookmarkKey(prayerId, stepId);
        return get().bookmarks.some((b) => bookmarkKey(b.prayerId, b.stepId) === key);
      },
    }),
    {
      name: 'ahlulbayt-prayer-academy-bookmarks',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

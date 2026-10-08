import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

interface RecommendationState {
  dismissedIds: string[];
  recentlyShownIds: string[];
  dismiss: (id: string) => void;
  markShown: (ids: string[]) => void;
  clearDismissed: () => void;
}

const MAX_RECENT = 20;

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      dismissedIds: [],
      recentlyShownIds: [],
      dismiss: (id) =>
        set((s) => ({
          dismissedIds: s.dismissedIds.includes(id)
            ? s.dismissedIds
            : [...s.dismissedIds, id],
        })),
      markShown: (ids) =>
        set((s) => ({
          recentlyShownIds: [...ids, ...s.recentlyShownIds]
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, MAX_RECENT),
        })),
      clearDismissed: () => set({ dismissedIds: [] }),
    }),
    {
      name: 'ahlulbayt-recommendations',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

interface SupportDismissState {
  dismissed: boolean;
  dismiss: () => void;
  reset: () => void;
}

export const useSupportDismissStore = create<SupportDismissState>()(
  persist(
    (set) => ({
      dismissed: false,
      dismiss: () => set({ dismissed: true }),
      reset: () => set({ dismissed: false }),
    }),
    {
      name: 'ahlulbayt-support-dismiss',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

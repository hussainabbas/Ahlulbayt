import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

interface SupportReminderState {
  lastReminderAt: number | null;
  markReminderShown: () => void;
  canShowReminder: (cooldownDays: number) => boolean;
}

export const useSupportReminderStore = create<SupportReminderState>()(
  persist(
    (set, get) => ({
      lastReminderAt: null,
      markReminderShown: () => set({ lastReminderAt: Date.now() }),
      canShowReminder: (cooldownDays) => {
        const last = get().lastReminderAt;
        if (!last) return true;
        const elapsed = Date.now() - last;
        return elapsed >= cooldownDays * 24 * 60 * 60 * 1000;
      },
    }),
    {
      name: 'ahlulbayt-support-reminder',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

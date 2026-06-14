import { create } from 'zustand';

export interface ForegroundNotification {
  id: string;
  title: string;
  body: string;
  category?: string;
  data?: Record<string, string>;
  receivedAt: number;
}

interface ForegroundNotificationState {
  current: ForegroundNotification | null;
  queue: ForegroundNotification[];
  show: (notification: Omit<ForegroundNotification, 'receivedAt'>) => void;
  dismiss: () => void;
}

export const useForegroundNotificationStore = create<ForegroundNotificationState>((set, get) => ({
  current: null,
  queue: [],
  show: (notification) => {
    const entry: ForegroundNotification = { ...notification, receivedAt: Date.now() };
    const { current, queue } = get();
    if (!current) {
      set({ current: entry });
      return;
    }
    set({ queue: [...queue, entry] });
  },
  dismiss: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      set({ current: next, queue: rest });
      return;
    }
    set({ current: null });
  },
}));

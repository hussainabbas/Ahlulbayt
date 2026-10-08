import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type { AiMessage } from '../types';

interface AiChatState {
  messages: AiMessage[];
  addMessage: (message: AiMessage) => void;
  updateMessage: (id: string, patch: Partial<AiMessage>) => void;
  clearMessages: () => void;
}

const MAX_MESSAGES = 100;

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((s) => ({
          messages: [...s.messages, message].slice(-MAX_MESSAGES),
        })),
      updateMessage: (id, patch) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'ahlulbayt-ai-chat',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

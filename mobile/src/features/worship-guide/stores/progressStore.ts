import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { mmkvStorage } from '@/core/storage/mmkv';

import type {
  GuideLearningMode,
  WorshipGuideId,
  WorshipGuideLastSession,
  WorshipGuideProgress,
} from '../types';

interface WorshipGuideProgressState {
  byGuide: Partial<Record<WorshipGuideId, WorshipGuideProgress>>;
  lastSession: WorshipGuideLastSession | null;
  setStepProgress: (
    guideId: WorshipGuideId,
    stepId: string,
    mode: GuideLearningMode,
    guidedModeEnabled: boolean,
  ) => void;
  toggleChecklistItem: (guideId: WorshipGuideId, stepId: string, itemKey: string) => void;
  markComplete: (guideId: WorshipGuideId) => void;
  getProgress: (guideId: WorshipGuideId) => WorshipGuideProgress | undefined;
  setLastSession: (session: WorshipGuideLastSession) => void;
  clearLastSession: () => void;
  resetProgress: (guideId: WorshipGuideId) => void;
}

export const useWorshipGuideProgressStore = create<WorshipGuideProgressState>()(
  persist(
    (set, get) => ({
      byGuide: {},
      lastSession: null,
      setStepProgress: (guideId, stepId, mode, guidedModeEnabled) => {
        set((state) => {
          const prev = state.byGuide[guideId];
          const completed = new Set(prev?.completedStepIds ?? []);
          completed.add(stepId);
          return {
            byGuide: {
              ...state.byGuide,
              [guideId]: {
                guideId,
                completedStepIds: [...completed],
                checkedItems: prev?.checkedItems ?? {},
                lastStepId: stepId,
                mode,
                guidedModeEnabled,
              },
            },
          };
        });
      },
      toggleChecklistItem: (guideId, stepId, itemKey) => {
        set((state) => {
          const prev = state.byGuide[guideId];
          const checked = { ...(prev?.checkedItems ?? {}) };
          const list = new Set(checked[stepId] ?? []);
          if (list.has(itemKey)) list.delete(itemKey);
          else list.add(itemKey);
          checked[stepId] = [...list];
          return {
            byGuide: {
              ...state.byGuide,
              [guideId]: {
                guideId,
                completedStepIds: prev?.completedStepIds ?? [],
                checkedItems: checked,
                lastStepId: prev?.lastStepId,
                mode: prev?.mode ?? 'beginner',
                guidedModeEnabled: prev?.guidedModeEnabled ?? true,
              },
            },
          };
        });
      },
      markComplete: (guideId) => {
        set((state) => {
          const prev = state.byGuide[guideId];
          if (!prev) return state;
          return {
            byGuide: {
              ...state.byGuide,
              [guideId]: { ...prev, completedAt: new Date().toISOString() },
            },
          };
        });
      },
      getProgress: (guideId) => get().byGuide[guideId],
      setLastSession: (lastSession) => set({ lastSession }),
      clearLastSession: () => set({ lastSession: null }),
      resetProgress: (guideId) => {
        set((state) => {
          const next = { ...state.byGuide };
          delete next[guideId];
          return { byGuide: next };
        });
      },
    }),
    {
      name: 'ahlulbayt-worship-guide-progress',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

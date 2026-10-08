import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getBoolean, setBoolean } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';
import { mmkvStorage } from '@/core/storage/mmkv';
import { useSettingsStore } from '@/stores/settingsStore';
import type {
  AiTopicOption,
  InterestOption,
  MarjaOption,
  OnboardingStep,
} from '@/features/onboarding/types';
import { ONBOARDING_STEPS } from '@/features/onboarding/types';

interface OnboardingState {
  isComplete: boolean;
  currentStep: OnboardingStep;
  marja: MarjaOption;
  interests: InterestOption[];
  aiEnabled: boolean;
  aiTopics: AiTopicOption[];
  locationGranted: boolean;
  notificationsGranted: boolean;
  setCurrentStep: (step: OnboardingStep) => void;
  setMarja: (marja: MarjaOption) => void;
  toggleInterest: (interest: InterestOption) => void;
  setAiEnabled: (enabled: boolean) => void;
  toggleAiTopic: (topic: AiTopicOption) => void;
  setLocationGranted: (granted: boolean) => void;
  setNotificationsGranted: (granted: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialState = {
  isComplete: getBoolean(StorageKeys.ONBOARDING_COMPLETE, false),
  currentStep: 'welcome' as OnboardingStep,
  marja: 'sistani' as MarjaOption,
  interests: [] as InterestOption[],
  aiEnabled: true,
  aiTopics: ['daily_guidance', 'quran_reflection'] as AiTopicOption[],
  locationGranted: false,
  notificationsGranted: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setCurrentStep: (currentStep) => set({ currentStep }),
      setMarja: (marja) => set({ marja }),
      toggleInterest: (interest) => {
        const current = get().interests;
        set({
          interests: current.includes(interest)
            ? current.filter((i) => i !== interest)
            : [...current, interest],
        });
      },
      setAiEnabled: (aiEnabled) => set({ aiEnabled }),
      toggleAiTopic: (topic) => {
        const current = get().aiTopics;
        set({
          aiTopics: current.includes(topic)
            ? current.filter((t) => t !== topic)
            : [...current, topic],
        });
      },
      setLocationGranted: (locationGranted) => set({ locationGranted }),
      setNotificationsGranted: (notificationsGranted) => set({ notificationsGranted }),
      completeOnboarding: () => {
        const state = get();
        useSettingsStore.getState().setMarja(state.marja);
        useSettingsStore.getState().setInterests(state.interests);
        useSettingsStore.getState().setAiPreferences(state.aiEnabled, state.aiTopics);
        setBoolean(StorageKeys.ONBOARDING_COMPLETE, true);
        set({ isComplete: true, currentStep: ONBOARDING_STEPS[0]! });
      },
      resetOnboarding: () => {
        setBoolean(StorageKeys.ONBOARDING_COMPLETE, false);
        set({ ...initialState });
      },
    }),
    {
      name: 'ahlulbayt-onboarding',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        isComplete: state.isComplete,
        marja: state.marja,
        interests: state.interests,
        aiEnabled: state.aiEnabled,
        aiTopics: state.aiTopics,
        locationGranted: state.locationGranted,
        notificationsGranted: state.notificationsGranted,
      }),
    },
  ),
);

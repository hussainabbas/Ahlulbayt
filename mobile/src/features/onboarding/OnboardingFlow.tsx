import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, type ReactNode } from 'react';

import type { RootStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/stores/onboardingStore';
import type { OnboardingStep } from '@/features/onboarding/types';
import { getNextStep, getPrevStep } from '@/features/onboarding/types';

import { AiStep } from './steps/AiStep';
import { InterestsStep } from './steps/InterestsStep';
import { LanguageStep } from './steps/LanguageStep';
import { LocationStep } from './steps/LocationStep';
import { MadhabStep } from './steps/MadhabStep';
import { NotificationsStep } from './steps/NotificationsStep';
import { WelcomeStep } from './steps/WelcomeStep';

export function OnboardingFlow() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const setCurrentStep = useOnboardingStore((s) => s.setCurrentStep);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const goNext = useCallback(() => {
    const next = getNextStep(currentStep);
    if (next) {
      setCurrentStep(next);
    }
  }, [currentStep, setCurrentStep]);

  const goBack = useCallback(() => {
    const prev = getPrevStep(currentStep);
    if (prev) {
      setCurrentStep(prev);
    }
  }, [currentStep, setCurrentStep]);

  const finish = useCallback(() => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }, [completeOnboarding, navigation]);

  const skipPermission = useCallback(() => {
    goNext();
  }, [goNext]);

  const steps: Record<OnboardingStep, ReactNode> = {
    welcome: <WelcomeStep onContinue={goNext} />,
    language: <LanguageStep onContinue={goNext} onBack={goBack} />,
    madhab: <MadhabStep onContinue={goNext} onBack={goBack} />,
    location: (
      <LocationStep onContinue={goNext} onBack={goBack} onSkip={skipPermission} />
    ),
    notifications: (
      <NotificationsStep onContinue={goNext} onBack={goBack} onSkip={skipPermission} />
    ),
    interests: <InterestsStep onContinue={goNext} onBack={goBack} />,
    ai: <AiStep onContinue={finish} onBack={goBack} />,
  };

  return steps[currentStep];
}

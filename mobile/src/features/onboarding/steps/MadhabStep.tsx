import { ScrollView } from 'react-native';

import { useLocale } from '@/i18n/useLocale';
import { useOnboardingStore } from '@/stores/onboardingStore';
import type { MarjaOption } from '@/features/onboarding/types';
import { MARJA_OPTIONS } from '@/features/onboarding/types';

import { OnboardingShell } from '../components/OnboardingShell';
import { SelectionCard } from '../components/SelectionCard';

interface MadhabStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export function MadhabStep({ onContinue, onBack }: MadhabStepProps) {
  const { t } = useLocale();
  const marja = useOnboardingStore((s) => s.marja);
  const setMarja = useOnboardingStore((s) => s.setMarja);

  return (
    <OnboardingShell
      step="madhab"
      title={t('onboarding.madhab.title')}
      subtitle={t('onboarding.madhab.subtitle')}
      onContinue={onContinue}
      onBack={onBack}
      footerNote={t('onboarding.madhab.footer')}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {MARJA_OPTIONS.map((option) => (
          <SelectionCard
            key={option}
            title={t(`onboarding.madhab.options.${option}.title`)}
            subtitle={t(`onboarding.madhab.options.${option}.subtitle`)}
            selected={marja === option}
            onPress={() => setMarja(option as MarjaOption)}
          />
        ))}
      </ScrollView>
    </OnboardingShell>
  );
}

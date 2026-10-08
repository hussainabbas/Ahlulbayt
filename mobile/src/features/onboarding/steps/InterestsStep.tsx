import { ScrollView, StyleSheet, View } from 'react-native';

import { useLocale } from '@/i18n/useLocale';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { INTEREST_OPTIONS } from '@/features/onboarding/types';

import { OnboardingShell } from '../components/OnboardingShell';
import { InterestChip } from '../components/SelectionCard';

interface InterestsStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export function InterestsStep({ onContinue, onBack }: InterestsStepProps) {
  const { t } = useLocale();
  const interests = useOnboardingStore((s) => s.interests);
  const toggleInterest = useOnboardingStore((s) => s.toggleInterest);

  return (
    <OnboardingShell
      step="interests"
      title={t('onboarding.interests.title')}
      subtitle={t('onboarding.interests.subtitle')}
      onContinue={onContinue}
      onBack={onBack}
      continueDisabled={interests.length === 0}
      footerNote={t('onboarding.interests.footer')}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {INTEREST_OPTIONS.map((option) => (
            <InterestChip
              key={option}
              label={t(`onboarding.interests.options.${option}`)}
              selected={interests.includes(option)}
              onPress={() => toggleInterest(option)}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});

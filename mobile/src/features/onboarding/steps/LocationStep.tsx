import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { useOnboardingStore } from '@/stores/onboardingStore';

import { OnboardingShell } from '../components/OnboardingShell';
import { requestLocationPermission } from '../services/permissions';

interface LocationStepProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function LocationStep({ onContinue, onBack, onSkip }: LocationStepProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const locationGranted = useOnboardingStore((s) => s.locationGranted);
  const setLocationGranted = useOnboardingStore((s) => s.setLocationGranted);

  const handleContinue = async () => {
    if (locationGranted) {
      onContinue();
      return;
    }
    const granted = await requestLocationPermission();
    setLocationGranted(granted);
    if (granted) {
      onContinue();
    }
  };

  return (
    <OnboardingShell
      step="location"
      title={t('onboarding.location.title')}
      subtitle={t('onboarding.location.subtitle')}
      onContinue={handleContinue}
      onBack={onBack}
      onSkip={onSkip}
      continueLabel={
        locationGranted
          ? t('onboarding.continue')
          : t('onboarding.location.enable')
      }
      footerNote={t('onboarding.location.privacy')}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="displayMd">◎</Text>
        </View>
        <View style={styles.bullets}>
          {(['prayer', 'qibla', 'calendar'] as const).map((key) => (
            <View key={key} style={styles.bulletRow}>
              <Text variant="bodyMd" color="accent">
                ·
              </Text>
              <Text variant="bodyMd" color="secondary" style={styles.bulletText}>
                {t(`onboarding.location.benefits.${key}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 32,
    marginTop: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullets: {
    alignSelf: 'stretch',
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletText: {
    flex: 1,
    lineHeight: 24,
  },
});

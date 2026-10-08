import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { OnboardingShell } from '../components/OnboardingShell';

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <OnboardingShell
      step="welcome"
      title={t('onboarding.welcome.title')}
      subtitle={t('onboarding.welcome.subtitle')}
      onContinue={onContinue}
      showBack={false}
      continueLabel={t('onboarding.welcome.cta')}
    >
      <View style={styles.hero}>
        <View style={[styles.mark, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="displayMd" color="accent">
            ✦
          </Text>
        </View>
        <Text variant="bodyLg" color="secondary" style={styles.verse}>
          {t('onboarding.welcome.verse')}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('onboarding.welcome.verseRef')}
        </Text>
      </View>

      <View style={styles.features}>
        {(['prayer', 'quran', 'guidance'] as const).map((key) => (
          <View key={key} style={styles.featureRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.accentPrimary }]} />
            <Text variant="bodyMd" color="secondary">
              {t(`onboarding.welcome.features.${key}`)}
            </Text>
          </View>
        ))}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  mark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verse: {
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 12,
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { AI_TOPIC_OPTIONS } from '@/features/onboarding/types';

import { OnboardingShell } from '../components/OnboardingShell';
import { InterestChip } from '../components/SelectionCard';

interface AiStepProps {
  onContinue: () => void;
  onBack: () => void;
}

export function AiStep({ onContinue, onBack }: AiStepProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const aiEnabled = useOnboardingStore((s) => s.aiEnabled);
  const aiTopics = useOnboardingStore((s) => s.aiTopics);
  const setAiEnabled = useOnboardingStore((s) => s.setAiEnabled);
  const toggleAiTopic = useOnboardingStore((s) => s.toggleAiTopic);

  return (
    <OnboardingShell
      step="ai"
      title={t('onboarding.ai.title')}
      subtitle={t('onboarding.ai.subtitle')}
      onContinue={onContinue}
      onBack={onBack}
      continueLabel={t('onboarding.ai.finish')}
      footerNote={t('onboarding.ai.disclaimer')}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.toggleRow, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceElevated }]}>
          <View style={styles.toggleText}>
            <Text variant="headingSm">{t('onboarding.ai.personalizeTitle')}</Text>
            <Text variant="bodySm" color="secondary">
              {t('onboarding.ai.personalizeSubtitle')}
            </Text>
          </View>
          <Switch
            value={aiEnabled}
            onValueChange={setAiEnabled}
            trackColor={{ false: theme.colors.surfaceMuted, true: theme.colors.accentPrimary }}
            thumbColor={theme.colors.textInverse}
            accessibilityLabel={t('onboarding.ai.personalizeTitle')}
          />
        </View>

        {aiEnabled ? (
          <View style={styles.topics}>
            <Text variant="overline" color="secondary" style={styles.topicsLabel}>
              {t('onboarding.ai.topicsLabel')}
            </Text>
            <View style={styles.grid}>
              {AI_TOPIC_OPTIONS.map((topic) => (
                <InterestChip
                  key={topic}
                  label={t(`onboarding.ai.topics.${topic}`)}
                  selected={aiTopics.includes(topic)}
                  onPress={() => toggleAiTopic(topic)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.note, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="bodySm" color="secondary">
            {t('onboarding.ai.note')}
          </Text>
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  toggleText: {
    flex: 1,
    gap: 4,
  },
  topics: {
    gap: 12,
    marginBottom: 20,
  },
  topicsLabel: {
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  note: {
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
});

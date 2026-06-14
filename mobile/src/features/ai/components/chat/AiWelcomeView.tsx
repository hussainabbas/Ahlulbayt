import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { AiDisclaimerBanner } from '../AiDisclaimerBanner';
import { SuggestedPromptsGrid } from './SuggestedPromptsGrid';

interface AiWelcomeViewProps {
  onSelectPrompt: (messageKey: string) => void;
  disabled?: boolean;
}

export function AiWelcomeView({ onSelectPrompt, disabled }: AiWelcomeViewProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <View style={[styles.heroMark, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <View style={[styles.heroBar, { backgroundColor: theme.colors.accentGold }]} />
          <Text variant="headingSm" color="accent">
            {t('ai.welcome.greeting')}
          </Text>
        </View>
        <Text variant="headingMd" style={styles.title}>
          {t('ai.welcome.title')}
        </Text>
        <Text variant="bodyMd" color="secondary" style={styles.subtitle}>
          {t('ai.welcome.subtitle')}
        </Text>
      </View>
      <AiDisclaimerBanner />
      <SuggestedPromptsGrid onSelect={onSelectPrompt} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: layout.blockGap,
  },
  hero: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.blockGap,
    gap: layout.blockGap,
    alignItems: 'flex-start',
  },
  heroMark: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  title: {
    maxWidth: '92%',
  },
  subtitle: {
    lineHeight: 24,
    maxWidth: '95%',
  },
});

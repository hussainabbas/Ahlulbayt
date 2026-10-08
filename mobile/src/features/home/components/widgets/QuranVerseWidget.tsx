import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';
import type { DailyVerse } from '../../types';

interface QuranVerseWidgetProps {
  verse: DailyVerse;
}

export function QuranVerseWidget({ verse }: QuranVerseWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <DashboardWidget label={t('home.quranVerse')} accentColor={theme.colors.accentGold}>
      <Text
        variant="headingMd"
        style={[styles.arabic, { color: theme.colors.accentPrimary, textAlign: 'right' }]}
      >
        {verse.arabic}
      </Text>
      <Text variant="bodyMd" color="secondary" style={styles.translation}>
        "{verse.translation}"
      </Text>
      <View style={styles.footer}>
        <Text variant="caption" color="accent">
          {verse.surahName}
        </Text>
        <Text variant="caption" color="tertiary">
          {verse.reference}
        </Text>
      </View>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  arabic: {
    lineHeight: 36,
    writingDirection: 'rtl',
  },
  translation: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});

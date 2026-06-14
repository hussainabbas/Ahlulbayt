import { StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';
import type { DailyHadith } from '../../types';

interface HadithWidgetProps {
  hadith: DailyHadith;
}

export function HadithWidget({ hadith }: HadithWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <DashboardWidget label={t('home.hadith')} accentColor={theme.colors.prayer.dhuhr}>
      <Text variant="bodyLg" style={styles.quote}>
        "{hadith.text}"
      </Text>
      <Text variant="caption" color="secondary">
        — {hadith.narrator}
      </Text>
      <Text variant="caption" color="tertiary">
        {hadith.source}
      </Text>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  quote: {
    lineHeight: 28,
    fontStyle: 'italic',
  },
});

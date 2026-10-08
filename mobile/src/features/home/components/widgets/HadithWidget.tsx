import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';
import type { DailyHadith } from '../../types';

interface HadithWidgetProps {
  hadith: DailyHadith;
  onPress?: () => void;
}

export function HadithWidget({ hadith, onPress }: HadithWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
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
        {onPress ? (
          <Text variant="caption" color="accent" style={styles.tapHint}>
            {t('hadith.openDaily')} ›
          </Text>
        ) : null}
      </DashboardWidget>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quote: {
    lineHeight: 28,
    fontStyle: 'italic',
  },
  tapHint: { marginTop: 8 },
});

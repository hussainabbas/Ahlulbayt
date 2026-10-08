import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import type { FastingCountdownSnapshot } from '@/features/fasting/types';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CitationList } from './CitationList';
import type { RamadanDayEntry } from '../types';

interface DailyContentCardProps {
  daily: RamadanDayEntry;
  countdown?: FastingCountdownSnapshot;
  formatTime?: (date: Date) => string;
  onOpenDua: () => void;
}

export function DailyContentCard({
  daily,
  countdown,
  formatTime,
  onOpenDua,
}: DailyContentCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headingMd">
        {t('ramadanMode.dayTitle', { day: daily.day })} — {daily.theme.en}
      </Text>

      {countdown && formatTime ? (
        <View style={[styles.timing, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text variant="caption" color="secondary">
            {countdown.phase === 'sehri' ? t('ramadanMode.sehri') : t('ramadanMode.iftar')}:{' '}
            {countdown.countdownFormatted}
          </Text>
        </View>
      ) : null}

      <Pressable onPress={onOpenDua}>
        <Text variant="headingSm">{t('ramadanMode.dailyDua')}</Text>
        <Text variant="bodyMd">{daily.dua.title.en}</Text>
        <Text variant="bodySm" color="secondary">
          {daily.dua.translation.en}
        </Text>
        <CitationList citations={daily.dua.citations} compact />
      </Pressable>

      <View style={styles.section}>
        <Text variant="headingSm">{t('ramadanMode.dailyHadith')}</Text>
        <Text variant="bodySm" color="secondary">
          {daily.hadith.text.en}
        </Text>
        {daily.hadith.narrator ? (
          <Text variant="caption" color="tertiary">
            — {daily.hadith.narrator.en}
          </Text>
        ) : null}
        <CitationList citations={daily.hadith.citations} compact />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.blockGap },
  timing: {
    padding: layout.listGap,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  section: { gap: layout.listGap },
});

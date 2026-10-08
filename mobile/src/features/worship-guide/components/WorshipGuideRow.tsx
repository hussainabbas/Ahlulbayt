import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { WorshipGuideMeta } from '../types';
import { pickLocalized } from '../utils/localizedText';

interface WorshipGuideRowProps {
  meta: WorshipGuideMeta;
  progressPercent?: number;
  onPress: () => void;
}

export function WorshipGuideRow({ meta, progressPercent = 0, onPress }: WorshipGuideRowProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.body}>
        <Text variant="bodyMd" weight="600">
          {pickLocalized(meta.titles, locale)}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={2}>
          {pickLocalized(meta.subtitles, locale)}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('worshipGuide.minutesSteps', {
            minutes: meta.estimatedMinutes,
            steps: meta.stepCount,
          })}
        </Text>
      </View>
      {progressPercent > 0 ? (
        <View style={[styles.progressRing, { borderColor: theme.colors.accentPrimary }]}>
          <Text variant="caption" color="accent" weight="600">
            {Math.round(progressPercent)}%
          </Text>
        </View>
      ) : (
        <Text variant="bodyMd" color="accent">
          →
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    gap: 12,
  },
  body: { flex: 1, gap: 4 },
  progressRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

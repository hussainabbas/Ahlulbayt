import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useFastingHub } from '../hooks/useFastingHub';
import { SehriIftarCountdown } from './SehriIftarCountdown';

interface FastingWidgetCardProps {
  onPress: () => void;
}

export function FastingWidgetCard({ onPress }: FastingWidgetCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { countdown, formatTime, progress, isRamadan, isFasted } = useFastingHub();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text variant="overline" color="secondary">
            {isRamadan ? t('fasting.widget.ramadan') : t('fasting.widget.title')}
          </Text>
          <Text variant="caption" color="accent">
            {t('fasting.widget.open')}
          </Text>
        </View>

        <SehriIftarCountdown countdown={countdown} formatTime={formatTime} compact />

        {isRamadan ? (
          <View style={styles.progressRow}>
            <Text variant="bodySm" weight="600">
              {t('fasting.progress.days', {
                fasted: progress.fastedCount,
                total: progress.totalDays,
              })}
            </Text>
            <Text variant="caption" color="tertiary">
              {isFasted() ? t('fasting.tracker.marked') : t('fasting.tracker.unmarked')}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
});

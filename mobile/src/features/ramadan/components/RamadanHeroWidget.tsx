import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { FastingCountdownSnapshot } from '@/features/fasting/types';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

interface RamadanHeroWidgetProps {
  countdown: FastingCountdownSnapshot;
  formatTime: (date: Date) => string;
  isFasted: boolean;
  onToggleFast: () => void;
  onOpenHub: () => void;
}

export function RamadanHeroWidget({
  countdown,
  formatTime,
  isFasted,
  onToggleFast,
  onOpenHub,
}: RamadanHeroWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isSehri = countdown.phase === 'sehri';
  const accent = isSehri ? theme.colors.prayer.fajr : theme.colors.prayer.maghrib;

  return (
    <Pressable
      onPress={onOpenHub}
      style={({ pressed }) => [
        styles.wrapper,
        getShadow('sm', theme.scheme),
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.content}>
        <Text variant="label" color="secondary">
          {t('home.ramadan.label')}
        </Text>

        <View style={styles.countdownRow}>
          <Text variant="displayLg" style={styles.countdown}>
            {countdown.countdownFormatted}
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: `${accent}20`, borderColor: `${accent}55` },
            ]}
          >
            <Text variant="headingSm" style={{ color: accent }}>
              {isSehri ? t('ramadanMode.sehri') : t('ramadanMode.iftar')}
            </Text>
          </View>
        </View>

        <Text variant="bodySm" color="secondary">
          {isSehri
            ? t('home.ramadan.sehriAt', { time: formatTime(countdown.targetTime) })
            : t('home.ramadan.iftarAt', { time: formatTime(countdown.targetTime) })}
        </Text>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onToggleFast();
          }}
          style={[styles.fastRow, { backgroundColor: theme.colors.backgroundSecondary }]}
        >
          <Text variant="caption" color="secondary">
            {t('home.ramadan.fastingToday')}
          </Text>
          <Text variant="bodySm" color="accent">
            {isFasted ? t('ramadanMode.fastStatus.fasted') : t('home.ramadan.tapToMark')}
          </Text>
        </Pressable>

        <Text variant="caption" color="accent">
          {t('home.ramadan.enterHub')} ›
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: { width: 4 },
  content: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
  },
  countdown: {
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  fastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

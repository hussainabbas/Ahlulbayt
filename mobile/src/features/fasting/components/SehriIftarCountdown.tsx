import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

import type { FastingCountdownSnapshot } from '../types';

interface SehriIftarCountdownProps {
  countdown: FastingCountdownSnapshot;
  formatTime: (date: Date) => string;
  compact?: boolean;
}

export function SehriIftarCountdown({
  countdown,
  formatTime,
  compact,
}: SehriIftarCountdownProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isSehri = countdown.phase === 'sehri';
  const accent = isSehri ? theme.colors.prayer.fajr : theme.colors.prayer.maghrib;
  const phaseLabel = isSehri ? t('fasting.sehri.title') : t('fasting.iftar.title');
  const endsLabel = isSehri ? t('fasting.sehri.endsAt') : t('fasting.iftar.at');

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Text variant="caption" color="secondary">
          {phaseLabel}
        </Text>
        <Text variant="headingSm" style={{ color: accent, fontVariant: ['tabular-nums'] }}>
          {countdown.countdownFormatted}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        getShadow('sm', theme.scheme),
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {phaseLabel}
        </Text>
        <Text variant="displayLg" style={[styles.countdown, { color: accent }]}>
          {countdown.countdownFormatted}
        </Text>
        <Text variant="bodySm" color="secondary">
          {endsLabel}: {formatTime(countdown.targetTime)}
        </Text>
        <Text variant="caption" color="tertiary">
          {isSehri ? t('fasting.sehri.hint') : t('fasting.iftar.hint')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  countdown: {
    fontVariant: ['tabular-nums'],
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: layout.blockGap,
  },
});

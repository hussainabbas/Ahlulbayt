import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { RamadanProgressSnapshot } from '../types';
import { SehriIftarCountdown } from './SehriIftarCountdown';
import type { FastingCountdownSnapshot } from '../types';

interface RamadanBannerProps {
  progress: RamadanProgressSnapshot;
  countdown: FastingCountdownSnapshot;
  formatTime: (date: Date) => string;
}

export function RamadanBanner({ progress, countdown, formatTime }: RamadanBannerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  return (
    <Pressable
      onPress={() => rootNavigation.navigate('Fasting')}
      style={({ pressed }) => [
        styles.wrapper,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {t('fasting.banner.label')}
        </Text>
        <Text variant="headingMd" style={styles.title}>
          {t('fasting.banner.title')}
        </Text>
        <SehriIftarCountdown countdown={countdown} formatTime={formatTime} compact />
        <Text variant="bodySm" color="secondary">
          {t('fasting.progress.days', {
            fasted: progress.fastedCount,
            total: progress.totalDays,
          })}
        </Text>
        <View style={styles.actionRow}>
          <Text variant="caption" color="accent">
            {t('fasting.banner.enter')}
          </Text>
          <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
        </View>
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
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  title: {
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: layout.listGap,
  },
});

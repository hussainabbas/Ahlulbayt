import Svg, { Circle } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { RamadanProgressSnapshot } from '../types';

interface RamadanProgressRingProps {
  progress: RamadanProgressSnapshot;
  size?: number;
}

export function RamadanProgressRing({ progress, size = 120 }: RamadanProgressRingProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress.progressRatio);

  return (
    <View style={styles.root}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.surfaceMuted}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.accentPrimary}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.center}>
          <Text variant="headingMd" color="accent">
            {progress.fastedCount}
          </Text>
          <Text variant="caption" color="tertiary">
            / {progress.totalDays}
          </Text>
        </View>
      </View>
      <View style={styles.stats}>
        <Text variant="bodySm" weight="600">
          {t('fasting.progress.title')}
        </Text>
        <Text variant="caption" color="secondary">
          {t('fasting.progress.streak', { count: progress.streak })}
        </Text>
        {progress.missedCount > 0 ? (
          <Text variant="caption" color="tertiary">
            {t('fasting.progress.missed', { count: progress.missedCount })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.blockGap + 4,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flex: 1,
    gap: 4,
  },
});

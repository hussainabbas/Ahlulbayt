import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface TasbihGoalProgressProps {
  current: number;
  goal: number;
  cycles: number;
  compact?: boolean;
}

export function TasbihGoalProgress({ current, goal, cycles, compact }: TasbihGoalProgressProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const progress = Math.min(1, current / goal);

  if (compact) {
    return (
      <View style={styles.compactRoot}>
        <View style={styles.header}>
          <Text variant="overline" color="secondary">
            {t('tasbih.dailyGoal')}
          </Text>
          <Text variant="caption" color="accent">
            {current} / {goal}
          </Text>
        </View>
        <View style={[styles.compactTrack, { backgroundColor: theme.colors.surfaceMuted }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: theme.colors.accentPrimary,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="overline" color="secondary">
          {t('tasbih.dailyGoal')}
        </Text>
        <Text variant="bodySm" weight="600" color="accent">
          {current} / {goal}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: theme.colors.accentPrimary,
            },
          ]}
        />
      </View>
      <Text variant="caption" color="tertiary" style={styles.cycles}>
        {t('tasbih.cyclesToday', { count: cycles })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactRoot: {
    gap: layout.listGap,
  },
  compactTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  root: {
    gap: layout.listGap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 2,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  cycles: {
    marginTop: layout.listGap,
  },
});

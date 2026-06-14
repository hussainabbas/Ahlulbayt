import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface TasbihGoalProgressProps {
  current: number;
  goal: number;
  cycles: number;
}

export function TasbihGoalProgress({ current, goal, cycles }: TasbihGoalProgressProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const progress = Math.min(1, current / goal);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="overline" color="secondary">
          {t('tasbih.dailyGoal')}
        </Text>
        <Text variant="caption" color="accent">
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
      <Text variant="caption" color="tertiary">
        {t('tasbih.cyclesToday', { count: cycles })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

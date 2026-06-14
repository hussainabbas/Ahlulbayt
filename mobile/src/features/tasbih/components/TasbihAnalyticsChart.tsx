import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { TasbihDailyRecord } from '../types';

interface TasbihAnalyticsChartProps {
  days: TasbihDailyRecord[];
  goalTotal: number;
}

export function TasbihAnalyticsChart({ days, goalTotal }: TasbihAnalyticsChartProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const max = Math.max(goalTotal, ...days.map((d) => d.total), 1);

  return (
    <View style={styles.root}>
      <Text variant="overline" color="secondary">
        {t('tasbih.analytics.last7Days')}
      </Text>
      <View style={styles.chart}>
        {days.map((day) => {
          const heightPct = (day.total / max) * 100;
          const met = day.total >= goalTotal;
          const dayLabel = day.date.slice(5);

          return (
            <View key={day.date} style={styles.barCol}>
              <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceMuted }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPct}%`,
                      backgroundColor: met
                        ? theme.colors.accentPrimary
                        : theme.colors.accentPrimaryMuted,
                    },
                  ]}
                />
              </View>
              <Text variant="caption" color="tertiary">
                {dayLabel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.blockGap,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 112,
    gap: layout.listGap,
    marginTop: layout.listGap,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: layout.listGap,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: 84,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
});

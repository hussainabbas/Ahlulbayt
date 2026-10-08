import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { RamadanCalendarDay, RamadanDayStatus } from '../types';

interface FastDayCalendarProps {
  days: RamadanCalendarDay[];
  onDayPress?: (day: RamadanCalendarDay) => void;
}

const STATUS_COLORS: Record<RamadanDayStatus, string> = {
  fasted: '#3D9B8A',
  sunnah: '#5BAF9E',
  missed: '#C45C5C',
  pending: '#9AA3A0',
  today: '#D4B87A',
  future: '#E8ECEA',
  none: '#E8ECEA',
};

export function FastDayCalendar({ days, onDayPress }: FastDayCalendarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="overline" color="secondary">
        {t('fasting.calendar.title')}
      </Text>
      <View style={styles.grid}>
        {days.map((day) => {
          const color = STATUS_COLORS[day.status] ?? theme.colors.surfaceMuted;
          const label = String(day.hijriDay);
          return (
            <Pressable
              key={day.hijriDay}
              onPress={onDayPress ? () => onDayPress(day) : undefined}
              disabled={!onDayPress}
              style={({ pressed }) => [
                styles.cell,
                {
                  backgroundColor: color + (day.status === 'future' ? '55' : 'CC'),
                  borderColor: day.status === 'today' ? theme.colors.accentGold : 'transparent',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text variant="caption" weight="600" style={styles.cellText}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.legend}>
        {(['fasted', 'missed', 'pending', 'today'] as RamadanDayStatus[]).map((status) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[status] }]} />
            <Text variant="caption" color="tertiary">
              {t(`fasting.calendar.status.${status}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.listGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cell: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  cellText: {
    fontVariant: ['tabular-nums'],
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_COLORS } from '../constants/categories';
import { getPrimaryCategory } from '../engine/calendarEngine';
import type { CalendarDayCell } from '../types';

interface CalendarMonthGridProps {
  cells: CalendarDayCell[];
  onSelectDay: (day: number) => void;
}

export function CalendarMonthGrid({ cells, onSelectDay }: CalendarMonthGridProps) {
  const { theme } = useTheme();

  const weeks: CalendarDayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <View style={[styles.grid, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.lg }]}>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((cell) => {
            const primary =
              cell.events.length > 0 ? getPrimaryCategory(cell.events[0]!) : null;
            const dotColor = primary ? CATEGORY_COLORS[primary] : theme.colors.accentPrimary;

            return (
              <Pressable
                key={cell.day}
                onPress={() => onSelectDay(cell.day)}
                style={[
                  styles.dayCell,
                  cell.isSelected && {
                    backgroundColor: theme.colors.accentPrimaryMuted,
                    borderColor: theme.colors.accentPrimary,
                  },
                  cell.isToday &&
                    !cell.isSelected && {
                      borderColor: theme.colors.accentGold,
                    },
                ]}
              >
                <Text
                  variant="bodySm"
                  weight={cell.isToday ? '600' : '400'}
                  color={cell.isSelected ? 'accent' : cell.isToday ? 'primary' : 'secondary'}
                >
                  {cell.day}
                </Text>
                {cell.events.length > 0 ? (
                  <View style={styles.dots}>
                    {cell.events.slice(0, 3).map((ev, i) => (
                      <View
                        key={ev.id}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: CATEGORY_COLORS[getPrimaryCategory(ev)],
                            opacity: 1 - i * 0.2,
                          },
                        ]}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={[styles.dot, { backgroundColor: 'transparent' }]} />
                )}
                {cell.hasHighPriority ? (
                  <View style={[styles.priorityRing, { borderColor: dotColor }]} />
                ) : null}
              </Pressable>
            );
          })}
          {week.length < 7
            ? Array.from({ length: 7 - week.length }).map((_, i) => (
                <View key={`pad-${i}`} style={styles.dayCell} />
              ))
            : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 8,
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 44,
    gap: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 2,
    height: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  priorityRing: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
  },
});

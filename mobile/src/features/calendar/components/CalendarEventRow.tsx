import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_COLORS } from '../constants/categories';
import { getPrimaryCategory } from '../engine/calendarEngine';
import type { ShiaCalendarEvent } from '../types';

interface CalendarEventRowProps {
  event: ShiaCalendarEvent;
  daysUntil?: number;
  isBookmarked?: boolean;
  onPress: () => void;
  onToggleBookmark?: () => void;
}

export function CalendarEventRow({
  event,
  daysUntil,
  isBookmarked,
  onPress,
  onToggleBookmark,
}: CalendarEventRowProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const category = getPrimaryCategory(event);
  const color = CATEGORY_COLORS[category];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: theme.colors.surfaceMuted },
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <Text variant="bodyMd" weight="500">
          {t(event.titleKey)}
        </Text>
        <Text variant="caption" color="secondary">
          {event.hijriDay}/{event.hijriMonth} · {t(`calendar.categories.${category}`)}
        </Text>
        {daysUntil != null ? (
          <Text variant="caption" color="tertiary">
            {daysUntil === 0
              ? t('calendar.today')
              : t('calendar.inDays', { days: daysUntil })}
          </Text>
        ) : null}
      </View>
      {onToggleBookmark ? (
        <Pressable onPress={onToggleBookmark} hitSlop={8}>
          <Text variant="bodySm" color={isBookmarked ? 'accent' : 'tertiary'}>
            {isBookmarked ? '★' : '☆'}
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.badge, { backgroundColor: `${color}18` }]}>
          <Text variant="caption" style={{ color }}>
            {event.hijriDay}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderRadius: 12,
  },
  indicator: {
    width: 3,
    height: 36,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
});

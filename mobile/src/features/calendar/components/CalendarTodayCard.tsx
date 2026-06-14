import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_COLORS } from '../constants/categories';
import { getPrimaryCategory } from '../engine/calendarEngine';
import type { ShiaCalendarEvent } from '../types';

interface CalendarTodayCardProps {
  events: ShiaCalendarEvent[];
  hijriFormatted: string;
  onEventPress: (event: ShiaCalendarEvent) => void;
}

export function CalendarTodayCard({ events, hijriFormatted, onEventPress }: CalendarTodayCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (events.length === 0) return null;

  const primary = getPrimaryCategory(events[0]!);
  const accent = CATEGORY_COLORS[primary];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={styles.body}>
        <Text variant="label" color="accent">
          {t('calendar.todayObservances')}
        </Text>
        <Text variant="caption" color="secondary" style={styles.date}>
          {hijriFormatted}
        </Text>
        {events.map((event, index) => (
          <Pressable
            key={event.id}
            onPress={() => onEventPress(event)}
            style={[
              styles.eventRow,
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: theme.colors.borderSubtle,
                paddingTop: layout.blockGap,
              },
            ]}
          >
            <Text variant="headingSm">{t(event.titleKey)}</Text>
            <Text variant="bodySm" color="secondary" numberOfLines={2}>
              {t(event.descriptionKey)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginTop: layout.sectionGap,
  },
  accentBar: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap,
  },
  date: {
    marginTop: 2,
  },
  eventRow: {
    gap: 4,
    paddingTop: layout.listGap,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'transparent',
  },
});

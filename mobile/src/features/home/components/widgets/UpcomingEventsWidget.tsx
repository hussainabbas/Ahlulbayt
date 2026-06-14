import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';
import type { IslamicEvent } from '../../types';

interface UpcomingEventsWidgetProps {
  events: IslamicEvent[];
}

const CATEGORY_COLORS: Record<IslamicEvent['category'], string> = {
  martyrdom: '#8B3A3A',
  birth: '#3D9B8A',
  occasion: '#C4A962',
  community: '#4A6FA5',
};

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <DashboardWidget label={t('home.events.title')}>
      <View style={styles.list}>
        {events.map((event, index) => {
          const color = CATEGORY_COLORS[event.category];
          return (
            <View
              key={event.id}
              style={[
                styles.row,
                index < events.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <View style={[styles.indicator, { backgroundColor: color }]} />
              <View style={styles.rowContent}>
                <Text variant="bodyMd" weight="500">
                  {t(event.titleKey)}
                </Text>
                <Text variant="caption" color="secondary">
                  {event.daysUntil === 0
                    ? t('home.events.today')
                    : t('home.events.inDays', { days: event.daysUntil })}
                </Text>
              </View>
              <View style={[styles.daysBadge, { backgroundColor: `${color}18` }]}>
                <Text variant="caption" style={{ color }}>
                  {event.hijriDay}/{event.hijriMonth}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 0,
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  indicator: {
    width: 3,
    height: 32,
    borderRadius: 2,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  daysBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

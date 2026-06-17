import { Pressable, StyleSheet, View } from 'react-native';

import type {
  CalendarEvent,
  ContentRecommendation,
  IslamicDateContext,
} from '@/core/islamic-calendar-ai';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useTheme } from '@/theme/ThemeContext';
import type { RootStackParamList } from '@/navigation/types';

import { DashboardWidget } from '../DashboardWidget';

const EVENT_TYPE_COLORS: Record<CalendarEvent['type'], string> = {
  shahadat: '#8B3A3A',
  wiladat: '#3D9B8A',
  eid: '#C4A962',
  season: '#6B4E9B',
  historical: '#4A6FA5',
};

const KIND_ICONS: Record<ContentRecommendation['kind'], 'book' | 'bookmark' | 'search'> = {
  dua: 'book',
  amaal: 'bookmark',
  ziyarat: 'bookmark',
  hadith: 'book',
  history: 'search',
  book: 'book',
  quran: 'book',
  masoomeen: 'search',
};

interface CalendarTodayWidgetProps {
  context: IslamicDateContext;
  events: CalendarEvent[];
  recommendations: ContentRecommendation[];
}

export function CalendarTodayWidget({
  context,
  events,
  recommendations,
}: CalendarTodayWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  if (events.length === 0 && recommendations.length === 0) return null;

  const openRecommendation = (rec: ContentRecommendation) => {
    const screen = rec.route as keyof RootStackParamList;
    const params = rec.routeParams as RootStackParamList[typeof screen] | undefined;
    if (params) {
      rootNavigation.navigate(screen, params as never);
    } else {
      rootNavigation.navigate(screen);
    }
  };

  const primaryEvent = events[0];
  const accent = primaryEvent
    ? EVENT_TYPE_COLORS[primaryEvent.type]
    : theme.colors.accentGold;

  return (
    <DashboardWidget
      label={t('islamicCalendarAi.widget.title')}
      actionLabel={t('islamicCalendarAi.widget.viewCalendar')}
      onAction={() => rootNavigation.navigate('Calendar')}
      accentColor={accent}
    >
      <Text variant="caption" color="secondary" style={styles.season}>
        {t(context.seasonLabelKey)}
      </Text>

      {events.length > 0 ? (
        <View style={styles.eventsBlock}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={[styles.eventDot, { backgroundColor: EVENT_TYPE_COLORS[event.type] }]} />
              <View style={styles.eventCopy}>
                <Text variant="bodyMd" weight="600">
                  {t(event.titleKey)}
                </Text>
                {event.significanceKey ? (
                  <Text variant="caption" color="secondary" numberOfLines={2}>
                    {t(event.significanceKey)}
                  </Text>
                ) : null}
                {event.unverified ? (
                  <Text variant="caption" color="secondary">
                    {t('islamicCalendarAi.widget.unverified')}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {recommendations.length > 0 ? (
        <View style={styles.recsBlock}>
          <Text variant="label" color="secondary">
            {t('islamicCalendarAi.widget.recommended')}
          </Text>
          {recommendations.slice(0, 4).map((rec) => (
            <Pressable
              key={rec.id}
              onPress={() => openRecommendation(rec)}
              style={({ pressed }) => [
                styles.recRow,
                {
                  borderColor: theme.colors.borderSubtle,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Icon name={KIND_ICONS[rec.kind]} size={18} color={accent} />
              <View style={styles.recCopy}>
                <Text variant="bodySm" weight="500">
                  {t(rec.titleKey)}
                </Text>
                <Text variant="caption" color="secondary" numberOfLines={1}>
                  {t(rec.bodyKey)}
                </Text>
              </View>
              <Icon name="chevron" size={16} color={theme.colors.textSecondary} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  season: {
    marginBottom: 8,
  },
  eventsBlock: {
    gap: 12,
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  eventDot: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginTop: 2,
  },
  eventCopy: {
    flex: 1,
    gap: 2,
  },
  recsBlock: {
    gap: 8,
    marginTop: 4,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  recCopy: {
    flex: 1,
    gap: 2,
  },
});

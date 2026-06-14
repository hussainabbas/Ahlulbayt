import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CalendarCategoryTabs } from '../components/CalendarCategoryTabs';
import { CalendarEventDetailSheet } from '../components/CalendarEventDetailSheet';
import { CalendarEventRow } from '../components/CalendarEventRow';
import { CalendarMonthGrid } from '../components/CalendarMonthGrid';
import { CalendarMonthHeader } from '../components/CalendarMonthHeader';
import { CalendarTodayCard } from '../components/CalendarTodayCard';
import { MuharramTimeline } from '../components/MuharramTimeline';
import { daysUntilHijriDate } from '../engine/hijriUtils';
import { useCalendar } from '../hooks/useCalendar';
import { useCalendarStore } from '../stores/calendarStore';
import type { CalendarEventInstance, ShiaCalendarEvent } from '../types';

export function CalendarScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toggleBookmark = useCalendarStore((s) => s.toggleBookmark);
  const setPreferredFilter = useCalendarStore((s) => s.setPreferredFilter);

  const {
    today,
    viewYear,
    viewMonth,
    selectedDay,
    setSelectedDay,
    filter,
    setFilter,
    monthGrid,
    selectedDayEvents,
    todayEvents,
    upcoming,
    muharramTimeline,
    hijriFormatted,
    bookmarkedIds,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    isViewingToday,
    showMuharramTimeline,
  } = useCalendar();

  const [detailEvent, setDetailEvent] = useState<ShiaCalendarEvent | null>(null);

  const onFilterChange = (f: typeof filter) => {
    setFilter(f);
    setPreferredFilter(f);
  };

  const openDetail = (event: ShiaCalendarEvent) => setDetailEvent(event);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('calendar.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  const listEvents: Array<ShiaCalendarEvent | CalendarEventInstance> =
    selectedDay != null && selectedDayEvents.length > 0
      ? selectedDayEvents
      : selectedDay != null
        ? []
        : upcoming;

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: layout.screenPaddingX }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title={t('calendar.title')} subtitle={t('calendar.subtitle')} />

        <CalendarTodayCard
          events={todayEvents}
          hijriFormatted={hijriFormatted}
          onEventPress={openDetail}
        />

        <CalendarCategoryTabs active={filter} onChange={onFilterChange} />

        <CalendarMonthHeader
          year={viewYear}
          month={viewMonth}
          isToday={isViewingToday}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
        />

        <CalendarMonthGrid
          cells={monthGrid}
          onSelectDay={(day) => setSelectedDay(day)}
        />

        {showMuharramTimeline && filter !== 'ghadeer' && filter !== 'mubahila' ? (
          <MuharramTimeline
            events={muharramTimeline}
            currentDay={today.month === 1 ? today.day : 0}
            onEventPress={openDetail}
          />
        ) : null}

        <View style={styles.section}>
          <Text variant="headingSm">
            {selectedDay != null
              ? t('calendar.dayEvents', { day: selectedDay })
              : t('calendar.upcoming')}
          </Text>

          <Card padded={false}>
            {listEvents.length === 0 ? (
              <Text variant="bodySm" color="secondary" style={styles.empty}>
                {t('calendar.noEvents')}
              </Text>
            ) : (
              listEvents.map((event, index) => (
                <View
                  key={event.id}
                  style={
                    index < listEvents.length - 1
                      ? {
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: theme.colors.borderSubtle,
                          paddingHorizontal: 12,
                        }
                      : { paddingHorizontal: 12 }
                  }
                >
                  <CalendarEventRow
                    event={event}
                    daysUntil={
                      'daysUntil' in event
                        ? event.daysUntil
                        : daysUntilHijriDate(
                            today.month,
                            today.day,
                            event.hijriMonth,
                            event.hijriDay,
                          )
                    }
                    isBookmarked={bookmarkedIds.includes(event.id)}
                    onPress={() => openDetail(event)}
                    onToggleBookmark={() => toggleBookmark(event.id)}
                  />
                </View>
              ))
            )}
          </Card>
        </View>

        <Text variant="caption" color="tertiary" style={styles.offline}>
          {t('calendar.offline')}
        </Text>
      </ScrollView>

      <CalendarEventDetailSheet
        event={detailEvent}
        visible={detailEvent != null}
        isBookmarked={detailEvent ? bookmarkedIds.includes(detailEvent.id) : false}
        onClose={() => setDetailEvent(null)}
        onToggleBookmark={() => detailEvent && toggleBookmark(detailEvent.id)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
  },
  offline: {
    textAlign: 'center',
  },
});

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';

import { DashboardHeader } from '../components/DashboardHeader';
import { AiRecommendationsWidget } from '../components/widgets/AiRecommendationsWidget';
import { PersonalizedRecommendationFeed } from '../components/widgets/PersonalizedRecommendationFeed';
import { DailyTimelineWidget } from '../components/widgets/DailyTimelineWidget';
import { FeaturedSeasonalWidget } from '../components/widgets/FeaturedSeasonalWidget';
import { CalendarTodayWidget } from '../components/widgets/CalendarTodayWidget';
import { DuaWidget } from '../components/widgets/DuaWidget';
import { HadithWidget } from '../components/widgets/HadithWidget';
import { IslamicDateWidget } from '../components/widgets/IslamicDateWidget';
import { MuharramBanner } from '../components/widgets/MuharramBanner';
import { useFastingHub } from '@/features/fasting/hooks/useFastingHub';
import { LaylatAlQadrBanner } from '@/features/ramadan/components/LaylatAlQadrBanner';
import { QuranGoalWidget } from '@/features/ramadan/components/QuranGoalWidget';
import { RamadanDailyWidget } from '@/features/ramadan/components/RamadanDailyWidget';
import { RamadanHeroWidget } from '@/features/ramadan/components/RamadanHeroWidget';
import { NextPrayerWidget } from '../components/widgets/NextPrayerWidget';
import { QuranVerseWidget } from '../components/widgets/QuranVerseWidget';
import { SeasonalPrioritiesWidget } from '../components/widgets/SeasonalPrioritiesWidget';
import { TasbihWidget } from '../components/widgets/TasbihWidget';
import { UpcomingEventsWidget } from '../components/widgets/UpcomingEventsWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { useDashboard } from '../hooks/useDashboard';

export const HomeScreen = memo(function HomeScreen() {
  const rootNavigation = useRootNavigation();
  const fastingHub = useFastingHub();
  const {
    t,
    displayName,
    cityName,
    locationLoading,
    gregorian,
    hijri,
    nextPrayer,
    countdown,
    nextPrayerTime,
    timezone,
    weather,
    weatherLoading,
    weatherError,
    weatherRefreshing,
    refetchWeather,
    verse,
    hadith,
    dua,
    events,
    calendarAi,
    recommendations,
    personalizedRecs,
    showMuharramBanner,
    showRamadanExperience,
    ramadanDaily,
    islamicContext,
    homePriorities,
    dailyTimeline,
    featuredSeasonal,
  } = useDashboard();

  return (
    <Screen
      scroll
      padded={false}
      refreshing={weatherRefreshing}
      onRefresh={() => void refetchWeather()}
    >
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <DashboardHeader
            greeting={t('home.greeting')}
            name={displayName}
            city={cityName}
            locationLoading={locationLoading}
          />

          <View style={styles.dateWeatherRow}>
            <IslamicDateWidget hijri={hijri} gregorian={gregorian} />
            <WeatherWidget
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
              onRetry={() => void refetchWeather()}
            />
          </View>
        </View>

        {showMuharramBanner ? <MuharramBanner hijri={hijri} /> : null}

        {showRamadanExperience ? (
          <>
            <RamadanHeroWidget
              countdown={fastingHub.countdown}
              formatTime={fastingHub.formatTime}
              isFasted={fastingHub.isFasted()}
              onToggleFast={() => fastingHub.toggleFast('ramadan')}
              onOpenHub={() => rootNavigation.navigate('RamadanHub')}
            />
            {hijri.isLastTenNights ? (
              <LaylatAlQadrBanner
                hijriDay={hijri.day}
                isOddNight={hijri.day % 2 === 1}
                onPress={() => rootNavigation.navigate('LaylatAlQadr')}
              />
            ) : null}
            <QuranGoalWidget onOpenHub={() => rootNavigation.navigate('RamadanHub')} />
            {ramadanDaily ? <RamadanDailyWidget daily={ramadanDaily} /> : null}
          </>
        ) : null}

        {calendarAi.homeWidgetPlan.includes('calendar_today') &&
        (calendarAi.todayEvents.length > 0 || calendarAi.recommendations.length > 0) ? (
          <CalendarTodayWidget
            context={calendarAi.context}
            events={calendarAi.todayEvents}
            recommendations={calendarAi.recommendations}
          />
        ) : null}

        {islamicContext.season !== 'general' ? (
          <>
            <DailyTimelineWidget entries={dailyTimeline} />
            <SeasonalPrioritiesWidget
              seasonLabelKey={islamicContext.seasonLabelKey}
              priorities={homePriorities}
            />
            <FeaturedSeasonalWidget items={featuredSeasonal} />
          </>
        ) : null}

        {!showRamadanExperience ? (
          <NextPrayerWidget
            nextPrayer={nextPrayer}
            countdown={countdown}
            nextPrayerTime={nextPrayerTime}
            timezone={timezone}
          />
        ) : null}

        <TasbihWidget />

        <PersonalizedRecommendationFeed
          items={personalizedRecs.items}
          dismiss={personalizedRecs.dismiss}
          trackImpression={personalizedRecs.trackImpression}
        />

        <AiRecommendationsWidget recommendations={recommendations} />

        {!showRamadanExperience ? (
          <>
            <QuranVerseWidget verse={verse} />
            <HadithWidget
              hadith={hadith}
              onPress={
                hadith.hadithId
                  ? () => rootNavigation.navigate('HadithDetail', { hadithId: hadith.hadithId! })
                  : undefined
              }
            />
            <DuaWidget dua={dua} />
          </>
        ) : null}

        <UpcomingEventsWidget events={events} />
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.sectionGap,
    gap: layout.sectionGap,
  },
  heroSection: {
    gap: layout.listGap,
  },
  dateWeatherRow: {
    flexDirection: 'row',
    gap: layout.blockGap,
  },
});

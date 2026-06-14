import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { layout } from '@/theme/layout';

import { DashboardHeader } from '../components/DashboardHeader';
import { AiRecommendationsWidget } from '../components/widgets/AiRecommendationsWidget';
import { PersonalizedRecommendationFeed } from '../components/widgets/PersonalizedRecommendationFeed';
import { DuaWidget } from '../components/widgets/DuaWidget';
import { HadithWidget } from '../components/widgets/HadithWidget';
import { IslamicDateWidget } from '../components/widgets/IslamicDateWidget';
import { MuharramBanner } from '../components/widgets/MuharramBanner';
import { NextPrayerWidget } from '../components/widgets/NextPrayerWidget';
import { QuranVerseWidget } from '../components/widgets/QuranVerseWidget';
import { TasbihWidget } from '../components/widgets/TasbihWidget';
import { UpcomingEventsWidget } from '../components/widgets/UpcomingEventsWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { useDashboard } from '../hooks/useDashboard';

export const HomeScreen = memo(function HomeScreen() {
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
    recommendations,
    personalizedRecs,
    showMuharramBanner,
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

        <NextPrayerWidget
          nextPrayer={nextPrayer}
          countdown={countdown}
          nextPrayerTime={nextPrayerTime}
          timezone={timezone}
        />

        <TasbihWidget />

        <PersonalizedRecommendationFeed
          items={personalizedRecs.items}
          dismiss={personalizedRecs.dismiss}
          trackImpression={personalizedRecs.trackImpression}
        />

        <AiRecommendationsWidget recommendations={recommendations} />

        <QuranVerseWidget verse={verse} />

        <HadithWidget hadith={hadith} />

        <DuaWidget dua={dua} />

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

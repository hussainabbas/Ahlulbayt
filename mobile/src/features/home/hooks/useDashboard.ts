import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getIslamicEventsSnapshot } from '@/core/islamic-events';
import { useHijriClock } from '@/features/calendar/hooks/useHijriClock';
import { useLocale } from '@/i18n/useLocale';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePrayerClockStore } from '@/features/prayer/stores/prayerClockStore';

import { useRecommendations } from '@/features/ai/recommendations/hooks/useRecommendations';
import { getIslamicCalendarAiSnapshot } from '@/core/islamic-calendar-ai';

import { getRamadanDay } from '@/features/ramadan/engine/ramadanRepository';

import { getAiRecommendations } from '../data/aiSuggestions';
import { getTodaysDua, getTodaysHadith, getTodaysVerse } from '../data/dailyContent';
import { getUpcomingEvents } from '../data/islamicEvents';
import { getGregorianFormatted, getHijriDate } from '../services/hijriDate';
import { fetchWeather } from '../services/weatherApi';
import { useLocationStore } from '@/stores/locationStore';

export function useDashboard() {
  const { locale, t } = useLocale();
  const displayName = useAuthStore((s) => s.user?.displayName);
  const interests = useSettingsStore((s) => s.interests);
  const aiTopics = useSettingsStore((s) => s.aiTopics);
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);

  const cityName = usePrayerClockStore((s) => s.cityName);
  const nextPrayer = usePrayerClockStore((s) => s.nextPrayer);
  const countdown = usePrayerClockStore((s) => s.countdown);
  const nextPrayerTime = usePrayerClockStore((s) => s.nextPrayerTime);
  const timezone = usePrayerClockStore((s) => s.timezone);
  const gpsReady = usePrayerClockStore((s) => s.gpsReady);
  const now = useHijriClock();
  const hijri = useMemo(() => getHijriDate(now, locale), [now, locale]);
  const gregorian = useMemo(() => getGregorianFormatted(now, locale), [now, locale]);

  const islamicEvents = useMemo(
    () => getIslamicEventsSnapshot(now, locale),
    [now, locale],
  );

  const weatherQuery = useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => fetchWeather(latitude!, longitude!),
    enabled: latitude != null && longitude != null,
    staleTime: 30 * 60_000,
    retry: 1,
  });

  const verse = useMemo(() => getTodaysVerse(now), [now]);
  const hadith = useMemo(() => getTodaysHadith(now, locale), [now, locale]);
  const dua = useMemo(() => getTodaysDua(now), [now]);

  const events = useMemo(
    () => getUpcomingEvents(hijri.month, hijri.day),
    [hijri.month, hijri.day],
  );

  const calendarAi = useMemo(
    () => getIslamicCalendarAiSnapshot(now, locale),
    [now, locale],
  );

  const recommendations = useMemo(
    () =>
      aiEnabled
        ? getAiRecommendations(interests, aiTopics, hijri.isMuharram || hijri.isAshuraPeriod)
        : [],
    [aiEnabled, interests, aiTopics, hijri.isMuharram, hijri.isAshuraPeriod],
  );

  const personalizedRecs = useRecommendations(6);

  const showMuharramBanner =
    !hijri.isRamadan &&
    (hijri.isMuharram || hijri.isAshuraPeriod || (hijri.month === 12 && hijri.day >= 20));

  const showRamadanExperience = hijri.isRamadan;

  const ramadanDay = hijri.isRamadan ? hijri.day : 1;
  const ramadanDaily = useMemo(
    () => (showRamadanExperience ? getRamadanDay(ramadanDay) : undefined),
    [showRamadanExperience, ramadanDay],
  );

  return {
    t,
    locale,
    displayName,
    cityName,
    gregorian,
    hijri,
    nextPrayer,
    countdown,
    nextPrayerTime,
    timezone,
    weather: weatherQuery.data,
    weatherLoading: weatherQuery.isLoading,
    weatherError: weatherQuery.isError,
    weatherRefreshing: weatherQuery.isFetching && !weatherQuery.isLoading,
    refetchWeather: weatherQuery.refetch,
    locationLoading: !gpsReady,
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
    islamicContext: islamicEvents.context,
    homePriorities: islamicEvents.homePriorities,
    dailyTimeline: islamicEvents.dailyTimeline,
    featuredSeasonal: islamicEvents.featuredContent,
  };
}
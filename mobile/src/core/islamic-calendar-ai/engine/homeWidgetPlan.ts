import type { IslamicDateContext, HomeWidgetId } from '../types';

/** Ordered home dashboard widget priority based on today's Islamic context. */
export function getHomeWidgetPlan(context: IslamicDateContext): HomeWidgetId[] {
  const { hijriMonth, hijriDay } = context;
  const isMuharram = hijriMonth === 1;
  const isAshuraWindow = isMuharram && hijriDay <= 10;
  const isRamadan = hijriMonth === 9;
  const isHighObservance =
    isAshuraWindow ||
    isRamadan ||
    (hijriMonth === 12 && (hijriDay === 10 || hijriDay === 18 || hijriDay === 24)) ||
    (hijriMonth === 2 && hijriDay === 20);

  const base: HomeWidgetId[] = [
    'islamic_date',
    'weather',
    'next_prayer',
    'tasbih',
  ];

  if (isHighObservance) {
    return [
      'calendar_today',
      ...(isMuharram ? (['muharram_banner'] as HomeWidgetId[]) : []),
      ...base,
      'personalized_recs',
      'ai_recommendations',
      'quran_verse',
      'hadith',
      'dua',
      'upcoming_events',
    ];
  }

  if (isMuharram) {
    return [
      'muharram_banner',
      'calendar_today',
      ...base,
      'personalized_recs',
      'ai_recommendations',
      'quran_verse',
      'hadith',
      'dua',
      'upcoming_events',
    ];
  }

  return [
    ...base,
    'calendar_today',
    'personalized_recs',
    'ai_recommendations',
    'quran_verse',
    'hadith',
    'dua',
    'upcoming_events',
  ];
}

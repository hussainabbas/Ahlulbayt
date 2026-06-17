import type { RootStackParamList } from '@/navigation/types';

import type { EventReference } from '@/core/islamic-events/types';

/** Scholarly citation attached to calendar AI recommendations. */
export type IslamicSourceCitation = EventReference & {
  verified: boolean;
};

export interface IslamicDateContext {
  hijriYear: number;
  hijriMonth: number;
  hijriDay: number;
  locale: string;
  seasonLabelKey: string;
  gregorianDate: Date;
}

export type CalendarEventType =
  | 'wiladat'
  | 'shahadat'
  | 'eid'
  | 'season'
  | 'historical';

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  titleKey: string;
  descriptionKey: string;
  hijriMonth: number;
  hijriDay: number;
  significanceKey?: string;
  references: IslamicSourceCitation[];
  unverified: boolean;
  priority: number;
  amaalKey?: string;
  isToday: boolean;
  daysUntil: number;
}

export type ContentRecommendationKind =
  | 'dua'
  | 'amaal'
  | 'ziyarat'
  | 'hadith'
  | 'history'
  | 'book'
  | 'quran'
  | 'masoomeen';

export interface ContentRecommendation {
  id: string;
  kind: ContentRecommendationKind;
  titleKey: string;
  bodyKey: string;
  route: keyof RootStackParamList;
  routeParams?: RootStackParamList[keyof RootStackParamList];
  references: IslamicSourceCitation[];
  unverified: boolean;
  priority: number;
  eventId?: string;
}

export type HomeWidgetId =
  | 'calendar_today'
  | 'muharram_banner'
  | 'islamic_date'
  | 'weather'
  | 'next_prayer'
  | 'tasbih'
  | 'personalized_recs'
  | 'ai_recommendations'
  | 'quran_verse'
  | 'hadith'
  | 'dua'
  | 'upcoming_events';

export interface IslamicCalendarAiSnapshot {
  context: IslamicDateContext;
  todayEvents: CalendarEvent[];
  recommendations: ContentRecommendation[];
  homeWidgetPlan: HomeWidgetId[];
}

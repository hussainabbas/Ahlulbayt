import type { DuaId } from '@/features/dua/types';
import type { ZiyaratId } from '@/features/ziyarat/types';
import type { AyahRef } from '@/features/quran/types';

export type RecommendationCategory = 'verse' | 'dua' | 'ziyarat' | 'fasting' | 'amaal';

export type RecommendationReason =
  | 'date'
  | 'behavior'
  | 'event'
  | 'date_event'
  | 'behavior_date';

export interface RecommendationPayload {
  ayahRef?: AyahRef;
  quranTopicId?: string;
  quranSearchQuery?: string;
  duaId?: DuaId;
  ziyaratId?: ZiyaratId;
  route?: 'Prayer' | 'Tasbih' | 'TasbihCounter' | 'MuharramMode' | 'Calendar' | 'Mafatih';
  mafatihRef?: string;
}

export interface RecommendableItem {
  id: string;
  category: RecommendationCategory;
  titleKey: string;
  subtitleKey: string;
  tags: string[];
  /** Interest options that boost this item */
  interests?: string[];
  /** Calendar event ids that boost this item */
  eventIds?: string[];
  hijriMonth?: number;
  hijriDay?: number;
  hijriMonthRange?: [number, number];
  dayOfWeek?: number;
  hourStart?: number;
  hourEnd?: number;
  payload: RecommendationPayload;
  baseWeight: number;
}

export interface ScoredRecommendation {
  item: RecommendableItem;
  score: number;
  reason: RecommendationReason;
  reasonKey: string;
}

export interface RecommendationContext {
  locale: string;
  now: Date;
  hijriMonth: number;
  hijriDay: number;
  dayOfWeek: number;
  hour: number;
  interests: string[];
  aiTopics: string[];
  todayEventIds: string[];
  upcomingEventIds: string[];
  muharramSeason: boolean;
  bookmarkedDuas: string[];
  bookmarkedZiyarat: string[];
  bookmarkedQuranRefs: string[];
  bookmarkedSahifa: string[];
  tasbihCyclesToday: number;
  dismissedIds: string[];
  recentlyShownIds: string[];
}

export interface RecommendationFeed {
  items: ScoredRecommendation[];
  generatedAt: string;
}

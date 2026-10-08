/** Daily Life Duas — types (metadata + verified bundles). */

import type { IslamicCitation } from '@/core/citations';

export type DailyLifeCategoryId =
  | 'home'
  | 'sleep'
  | 'bathroom'
  | 'travel'
  | 'food'
  | 'family'
  | 'work'
  | 'health'
  | 'protection'
  | 'prayer';

export type DailyLifeSituationKey =
  | 'entering_home'
  | 'leaving_home'
  | 'before_sleeping'
  | 'after_waking'
  | 'entering_bathroom'
  | 'leaving_bathroom'
  | 'starting_journey'
  | 'entering_vehicle'
  | 'safe_travel'
  | 'before_eating'
  | 'after_eating'
  | 'drinking_water'
  | 'before_marriage'
  | 'for_spouse'
  | 'for_children'
  | 'before_work'
  | 'seeking_rizq'
  | 'success_in_work'
  | 'during_illness'
  | 'visiting_sick'
  | 'protection_health'
  | 'evil_eye'
  | 'from_harm'
  | 'from_fear'
  | 'adhan_response'
  | 'after_prayer'
  | 'before_prayer';

export type DailyLifeDuaId = `dl_${DailyLifeSituationKey}`;

export type QuickActionId = 'morning_dua' | 'evening_dua' | 'travel_dua' | 'home_dua';

export type DuaContentStatus = 'metadata_only' | 'bundled' | 'synced';

export interface LocalizedText {
  en: string;
  ur: string;
  ar?: string;
}

export interface DuaSourceAttribution {
  sourceBook: LocalizedText;
  narrator?: LocalizedText;
  sourceRef?: string;
  citations: IslamicCitation[];
}

export interface DailyLifeDuaMeta {
  id: DailyLifeDuaId;
  slug: string;
  situationKey: DailyLifeSituationKey;
  categoryIds: DailyLifeCategoryId[];
  titles: LocalizedText;
  subtitles?: LocalizedText;
  description: LocalizedText;
  tags: string[];
  quickAction?: QuickActionId;
  hasAudio: boolean;
  repeatCount?: number;
  estimatedSeconds: number;
  contentStatus: DuaContentStatus;
  /** Mafatih / Sahifa locator for scholar import — not user-facing paraphrase */
  mafatihRef?: string;
  attribution: DuaSourceAttribution;
}

export interface DailyLifeDuaSection {
  id: string;
  arabic: string;
  transliteration?: string;
  translations: { en?: string; ur?: string };
}

export interface DailyLifeDuaBundle {
  meta: DailyLifeDuaMeta;
  sections: DailyLifeDuaSection[];
  bundleVersion: number;
}

export interface DailyLifeCategory {
  id: DailyLifeCategoryId;
  titles: LocalizedText;
  icon: string;
  sortOrder: number;
  situations: DailyLifeSituationKey[];
}

export interface DailyLifeSearchHit {
  meta: DailyLifeDuaMeta;
  snippet?: string;
  score: number;
}

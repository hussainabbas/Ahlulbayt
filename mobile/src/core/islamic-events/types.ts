import type { IslamicReference } from '@/core/references/types';
import type { MainTabParamList, RootStackParamList } from '@/navigation/types';

/** Active liturgical / historical season derived from Hijri date. */
export type IslamicSeason =
  | 'muharram'
  | 'safar'
  | 'arbaeen'
  | 'ramadan'
  | 'laylat_al_qadr'
  | 'eid_fitr'
  | 'eid_adha'
  | 'eid_ghadeer'
  | 'mubahila'
  | 'general';

export type FeaturedContentKind =
  | 'book'
  | 'dua'
  | 'ziyarat'
  | 'hadith'
  | 'quran'
  | 'amaal'
  | 'majalis'
  | 'guide';

export type HomeWidgetKind =
  | 'muharram_timeline'
  | 'daily_events'
  | 'ziyarat_ashura'
  | 'daily_amaal'
  | 'recommended_duas'
  | 'recommended_majalis'
  | 'historical_events'
  | 'featured_books'
  | 'fasting_tracker'
  | 'sehri_countdown'
  | 'iftar_countdown'
  | 'quran_goal'
  | 'laylat_qadr'
  | 'eid_prayer_guide'
  | 'eid_amaal'
  | 'takbirat'
  | 'qurbani_guide'
  | 'arbaeen_ziyarat'
  | 'ghadeer_amaal'
  | 'mubahila_reflection'
  | 'calendar';

export interface NavigationTarget {
  screen: keyof RootStackParamList;
  params?: RootStackParamList[keyof RootStackParamList];
}

/** Scholarly citation attached to timeline / featured items. */
export interface EventReference extends IslamicReference {
  unverified?: boolean;
}

export interface EventTimelineEntry {
  id: string;
  hijriMonth: number;
  hijriDay: number;
  titleKey: string;
  bodyKey: string;
  references: EventReference[];
  /** True when no verified scholarly source is attached. */
  unverified: boolean;
  route?: NavigationTarget;
  duaId?: string;
  ziyaratId?: string;
  hadithId?: string;
  surahNumber?: number;
  ayah?: number;
}

export interface HomePriorityItem {
  id: string;
  kind: HomeWidgetKind;
  titleKey: string;
  subtitleKey?: string;
  priority: number;
  route?: NavigationTarget;
  /** Navigate to a main tab when no root-stack route applies. */
  tab?: keyof MainTabParamList;
}

export interface FeaturedContentItem {
  id: string;
  kind: FeaturedContentKind;
  titleKey: string;
  subtitleKey?: string;
  references: EventReference[];
  unverified: boolean;
  route?: NavigationTarget;
  duaId?: string;
  ziyaratId?: string;
  hadithId?: string;
  surahNumber?: number;
  ayah?: number;
}

export interface IslamicEventContext {
  season: IslamicSeason;
  hijriMonth: number;
  hijriDay: number;
  hijriYear: number;
  /** Human-readable season label i18n key */
  seasonLabelKey: string;
  isMuharram: boolean;
  isSafar: boolean;
  isRamadan: boolean;
  isAshuraPeriod: boolean;
  isArbaeenPeriod: boolean;
  isLaylatAlQadrWindow: boolean;
  activeEventIds: string[];
}

export interface IslamicEventsSnapshot {
  context: IslamicEventContext;
  homePriorities: HomePriorityItem[];
  dailyTimeline: EventTimelineEntry[];
  featuredContent: FeaturedContentItem[];
}

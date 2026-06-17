import type { FeaturedContentItem, HomePriorityItem, IslamicSeason } from '../types';
import { verifiedRef } from '../references';

const MUHARRAM_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_muharram_timeline',
    kind: 'muharram_timeline',
    titleKey: 'islamicEvents.home.muharram.timeline',
    subtitleKey: 'islamicEvents.home.muharram.timelineSub',
    priority: 10,
    route: { screen: 'MuharramMode' },
  },
  {
    id: 'hp_daily_events',
    kind: 'daily_events',
    titleKey: 'islamicEvents.home.muharram.dailyEvents',
    subtitleKey: 'islamicEvents.home.muharram.dailyEventsSub',
    priority: 9,
    route: { screen: 'Calendar' },
  },
  {
    id: 'hp_ziyarat_ashura',
    kind: 'ziyarat_ashura',
    titleKey: 'islamicEvents.home.muharram.ziyaratAshura',
    priority: 9,
    route: { screen: 'ZiyaratReader', params: { ziyaratId: 'ziyarat_ashura' } },
  },
  {
    id: 'hp_daily_amaal',
    kind: 'daily_amaal',
    titleKey: 'islamicEvents.home.muharram.dailyAmaal',
    priority: 8,
    route: { screen: 'MuharramMode' },
  },
  {
    id: 'hp_recommended_duas',
    kind: 'recommended_duas',
    titleKey: 'islamicEvents.home.muharram.recommendedDuas',
    priority: 7,
    route: { screen: 'Duas' },
  },
  {
    id: 'hp_majalis',
    kind: 'recommended_majalis',
    titleKey: 'islamicEvents.home.muharram.majalis',
    priority: 6,
    route: { screen: 'MuharramMode' },
  },
  {
    id: 'hp_historical',
    kind: 'historical_events',
    titleKey: 'islamicEvents.home.muharram.historical',
    priority: 5,
    route: { screen: 'Calendar' },
  },
  {
    id: 'hp_books',
    kind: 'featured_books',
    titleKey: 'islamicEvents.home.muharram.books',
    priority: 4,
    route: { screen: 'Mafatih' },
  },
];

const RAMADAN_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_fasting',
    kind: 'fasting_tracker',
    titleKey: 'islamicEvents.home.ramadan.fasting',
    subtitleKey: 'islamicEvents.home.ramadan.fastingSub',
    priority: 10,
    route: { screen: 'Fasting' },
  },
  {
    id: 'hp_sehri',
    kind: 'sehri_countdown',
    titleKey: 'islamicEvents.home.ramadan.sehri',
    priority: 9,
    route: { screen: 'Fasting' },
  },
  {
    id: 'hp_iftar',
    kind: 'iftar_countdown',
    titleKey: 'islamicEvents.home.ramadan.iftar',
    priority: 9,
    route: { screen: 'Fasting' },
  },
  {
    id: 'hp_quran_goal',
    kind: 'quran_goal',
    titleKey: 'islamicEvents.home.ramadan.quranGoal',
    priority: 8,
    tab: 'Quran',
  },
  {
    id: 'hp_laylat_qadr',
    kind: 'laylat_qadr',
    titleKey: 'islamicEvents.home.ramadan.laylatQadr',
    priority: 8,
    route: { screen: 'Duas' },
  },
  {
    id: 'hp_ramadan_amaal',
    kind: 'daily_amaal',
    titleKey: 'islamicEvents.home.ramadan.amaal',
    priority: 7,
    route: { screen: 'Mafatih' },
  },
];

const EID_FITR_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_eid_prayer',
    kind: 'eid_prayer_guide',
    titleKey: 'islamicEvents.home.eid.prayerGuide',
    priority: 10,
    route: { screen: 'PrayerAcademy' },
  },
  {
    id: 'hp_eid_amaal',
    kind: 'eid_amaal',
    titleKey: 'islamicEvents.home.eid.amaal',
    priority: 9,
    route: { screen: 'Mafatih' },
  },
  {
    id: 'hp_takbirat',
    kind: 'takbirat',
    titleKey: 'islamicEvents.home.eid.takbirat',
    priority: 8,
    route: { screen: 'Duas' },
  },
];

const EID_ADHA_PRIORITIES: HomePriorityItem[] = [
  ...EID_FITR_PRIORITIES,
  {
    id: 'hp_qurbani',
    kind: 'qurbani_guide',
    titleKey: 'islamicEvents.home.eid.qurbani',
    priority: 9,
    route: { screen: 'WorshipGuide' },
  },
];

const ARBAEEN_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_arbaeen_ziyarat',
    kind: 'arbaeen_ziyarat',
    titleKey: 'islamicEvents.home.arbaeen.ziyarat',
    priority: 10,
    route: { screen: 'ZiyaratReader', params: { ziyaratId: 'ziyarat_arbaeen' } },
  },
  {
    id: 'hp_arbaeen_amaal',
    kind: 'daily_amaal',
    titleKey: 'islamicEvents.home.arbaeen.amaal',
    priority: 8,
    route: { screen: 'Mafatih' },
  },
];

const GHADEER_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_ghadeer',
    kind: 'ghadeer_amaal',
    titleKey: 'islamicEvents.home.ghadeer.amaal',
    priority: 10,
    route: { screen: 'Calendar' },
  },
  {
    id: 'hp_ghadeer_dua',
    kind: 'recommended_duas',
    titleKey: 'islamicEvents.home.ghadeer.duas',
    priority: 8,
    route: { screen: 'Duas' },
  },
];

const MUBAHILA_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_mubahila',
    kind: 'mubahila_reflection',
    titleKey: 'islamicEvents.home.mubahila.reflection',
    priority: 10,
    route: { screen: 'Calendar' },
  },
  {
    id: 'hp_mubahila_quran',
    kind: 'quran_goal',
    titleKey: 'islamicEvents.home.mubahila.quran',
    priority: 8,
    route: { screen: 'QuranReader', params: { surahNumber: 3 } },
  },
];

const GENERAL_PRIORITIES: HomePriorityItem[] = [
  {
    id: 'hp_calendar',
    kind: 'calendar',
    titleKey: 'islamicEvents.home.general.calendar',
    priority: 5,
    route: { screen: 'Calendar' },
  },
];

const PRIORITY_MAP: Record<IslamicSeason, HomePriorityItem[]> = {
  muharram: MUHARRAM_PRIORITIES,
  safar: ARBAEEN_PRIORITIES,
  arbaeen: ARBAEEN_PRIORITIES,
  ramadan: RAMADAN_PRIORITIES,
  laylat_al_qadr: RAMADAN_PRIORITIES.filter((p) =>
    ['hp_laylat_qadr', 'hp_quran_goal', 'hp_ramadan_amaal', 'hp_fasting'].includes(p.id),
  ),
  eid_fitr: EID_FITR_PRIORITIES,
  eid_adha: EID_ADHA_PRIORITIES,
  eid_ghadeer: GHADEER_PRIORITIES,
  mubahila: MUBAHILA_PRIORITIES,
  general: GENERAL_PRIORITIES,
};

export function getHomePrioritiesForSeason(season: IslamicSeason): HomePriorityItem[] {
  return [...(PRIORITY_MAP[season] ?? GENERAL_PRIORITIES)].sort(
    (a, b) => b.priority - a.priority,
  );
}

export const MUHARRAM_FEATURED: FeaturedContentItem[] = [
  {
    id: 'feat_ziyarat_ashura',
    kind: 'ziyarat',
    titleKey: 'islamicEvents.featured.ziyaratAshura',
    subtitleKey: 'islamicEvents.featured.ziyaratAshuraSub',
    references: [
      verifiedRef('ref_feat_ashura_mafatih', { en: 'Mafatih al-Jinan' }, {
        chapter: { en: 'Ziyarat Ashura' },
        contentRef: 'ziyarat:ziyarat_ashura',
      }),
    ],
    unverified: false,
    route: { screen: 'ZiyaratReader', params: { ziyaratId: 'ziyarat_ashura' } },
    ziyaratId: 'ziyarat_ashura',
  },
  {
    id: 'feat_dua_kumail',
    kind: 'dua',
    titleKey: 'islamicEvents.featured.duaKumail',
    references: [
      verifiedRef('ref_feat_kumail', { en: 'Mafatih al-Jinan' }, {
        chapter: { en: 'Dua Kumayl' },
        contentRef: 'dua:dua_kumail',
      }),
    ],
    unverified: false,
    route: { screen: 'DuaReader', params: { duaId: 'dua_kumail' } },
    duaId: 'dua_kumail',
  },
  {
    id: 'feat_quran_verse_patience',
    kind: 'quran',
    titleKey: 'islamicEvents.featured.quranPatience',
    references: [
      verifiedRef('ref_feat_quran_2_153', { en: 'Holy Quran' }, {
        surah: 2,
        ayah: 153,
        contentRef: 'quran:2:153',
      }),
    ],
    unverified: false,
    route: { screen: 'QuranReader', params: { surahNumber: 2, ayah: 153 } },
    surahNumber: 2,
    ayah: 153,
  },
];

export const RAMADAN_FEATURED: FeaturedContentItem[] = [
  {
    id: 'feat_ramadan_dua',
    kind: 'dua',
    titleKey: 'islamicEvents.featured.ramadanDua',
    references: [
      verifiedRef('ref_ramadan_dua', { en: 'Mafatih al-Jinan' }, {
        chapter: { en: 'Ramadan supplications' },
      }),
    ],
    unverified: false,
    route: { screen: 'Duas' },
  },
  {
    id: 'feat_quran_ramadan',
    kind: 'quran',
    titleKey: 'islamicEvents.featured.quranRamadan',
    references: [
      verifiedRef('ref_quran_2_185', { en: 'Holy Quran' }, { surah: 2, ayah: 185 }),
    ],
    unverified: false,
    route: { screen: 'QuranReader', params: { surahNumber: 2 } },
    surahNumber: 2,
  },
];

export const EID_FEATURED: FeaturedContentItem[] = [
  {
    id: 'feat_eid_prayer',
    kind: 'guide',
    titleKey: 'islamicEvents.featured.eidPrayer',
    references: [
      verifiedRef('ref_eid_prayer', { en: 'Islamic Laws — Office of Ayatollah Sistani' }, {
        chapter: { en: 'Eid prayers' },
      }),
    ],
    unverified: false,
    route: { screen: 'PrayerAcademy' },
  },
];

const FEATURED_MAP: Record<IslamicSeason, FeaturedContentItem[]> = {
  muharram: MUHARRAM_FEATURED,
  safar: MUHARRAM_FEATURED.slice(0, 1),
  arbaeen: [
    {
      id: 'feat_arbaeen',
      kind: 'ziyarat',
      titleKey: 'islamicEvents.featured.arbaeen',
      references: [
        verifiedRef('ref_arbaeen_ziyarat', { en: 'Mafatih al-Jinan' }, {
          contentRef: 'ziyarat:ziyarat_arbaeen',
        }),
      ],
      unverified: false,
      route: { screen: 'ZiyaratReader', params: { ziyaratId: 'ziyarat_arbaeen' } },
      ziyaratId: 'ziyarat_arbaeen',
    },
  ],
  ramadan: RAMADAN_FEATURED,
  laylat_al_qadr: RAMADAN_FEATURED,
  eid_fitr: EID_FEATURED,
  eid_adha: EID_FEATURED,
  eid_ghadeer: EID_FEATURED,
  mubahila: EID_FEATURED.slice(0, 1),
  general: [],
};

export function getFeaturedForSeason(season: IslamicSeason): FeaturedContentItem[] {
  return FEATURED_MAP[season] ?? [];
}

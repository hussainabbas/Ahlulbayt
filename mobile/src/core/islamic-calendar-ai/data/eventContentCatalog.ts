import { verifiedRef, unverifiedRef } from '@/core/islamic-events/references';
import type { EventReference } from '@/core/islamic-events/types';

import type { ContentRecommendationKind, IslamicSourceCitation } from '../types';
import type { RootStackParamList } from '@/navigation/types';

export interface EventContentSeed {
  eventId: string;
  significanceKey: string;
  references: EventReference[];
  items: Array<{
    id: string;
    kind: ContentRecommendationKind;
    titleKey: string;
    bodyKey: string;
    route: keyof RootStackParamList;
    routeParams?: Record<string, string>;
    references?: EventReference[];
    priority: number;
  }>;
}

function toCitation(ref: EventReference): IslamicSourceCitation {
  return {
    ...ref,
    verified: !ref.unverified && ref.verification === 'verified',
  };
}

/** Offline bundled links from calendar events → in-app worship content. */
export const EVENT_CONTENT_CATALOG: EventContentSeed[] = [
  // —— Muharram ——
  {
    eventId: 'ashura',
    significanceKey: 'islamicCalendarAi.events.ashura.significance',
    references: [
      verifiedRef('ref_ashura_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '91–108',
        scholar: { en: 'Shaykh al-Mufid' },
        contentRef: 'calendar:ashura',
      }),
    ],
    items: [
      {
        id: 'ashura_ziyarat',
        kind: 'ziyarat',
        titleKey: 'islamicCalendarAi.recs.ziyaratAshura.title',
        bodyKey: 'islamicCalendarAi.recs.ziyaratAshura.body',
        route: 'ZiyaratReader',
        routeParams: { ziyaratId: 'ziyarat_ashura' },
        priority: 10,
      },
      {
        id: 'ashura_muharram_mode',
        kind: 'history',
        titleKey: 'islamicCalendarAi.recs.ashuraHistory.title',
        bodyKey: 'islamicCalendarAi.recs.ashuraHistory.body',
        route: 'MuharramMode',
        priority: 9,
      },
      {
        id: 'ashura_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.ashura',
        bodyKey: 'islamicCalendarAi.recs.ashuraAmaal.body',
        route: 'MuharramMode',
        priority: 8,
      },
    ],
  },
  {
    eventId: 'tasua',
    significanceKey: 'islamicCalendarAi.events.tasua.significance',
    references: [
      verifiedRef('ref_tasua_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '78–79',
        scholar: { en: 'Shaykh al-Mufid' },
      }),
    ],
    items: [
      {
        id: 'tasua_ziyarat',
        kind: 'ziyarat',
        titleKey: 'islamicCalendarAi.recs.ziyaratWaritha.title',
        bodyKey: 'islamicCalendarAi.recs.ziyaratWaritha.body',
        route: 'ZiyaratReader',
        routeParams: { ziyaratId: 'ziyarat_waritha' },
        priority: 8,
      },
      {
        id: 'tasua_muharram',
        kind: 'history',
        titleKey: 'islamicCalendarAi.recs.tasuaHistory.title',
        bodyKey: 'islamicCalendarAi.recs.tasuaHistory.body',
        route: 'MuharramMode',
        priority: 7,
      },
    ],
  },
  {
    eventId: 'arbaeen',
    significanceKey: 'islamicCalendarAi.events.arbaeen.significance',
    references: [
      verifiedRef('ref_arbaeen_kafi', { en: 'Al-Kafi' }, {
        volume: 4,
        hadithNumber: '576',
        scholar: { en: 'Shaykh al-Kulayni' },
      }),
    ],
    items: [
      {
        id: 'arbaeen_ziyarat',
        kind: 'ziyarat',
        titleKey: 'islamicCalendarAi.recs.ziyaratArbaeen.title',
        bodyKey: 'islamicCalendarAi.recs.ziyaratArbaeen.body',
        route: 'ZiyaratReader',
        routeParams: { ziyaratId: 'ziyarat_arbaeen' },
        priority: 10,
      },
      {
        id: 'arbaeen_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.arbaeen',
        bodyKey: 'islamicCalendarAi.recs.arbaeenAmaal.body',
        route: 'Calendar',
        routeParams: { eventId: 'arbaeen' },
        priority: 8,
      },
    ],
  },

  // —— Ramadan ——
  {
    eventId: 'shahadat_imam_ali',
    significanceKey: 'islamicCalendarAi.events.shahadat_imam_ali.significance',
    references: [
      verifiedRef('ref_shahadat_ali_tabari', { en: 'Tarikh al-Tabari' }, {
        volume: 4,
        page: '411',
        scholar: { en: 'Muhammad ibn Jarir al-Tabari' },
        contentRef: 'calendar:shahadat_imam_ali',
      }),
      verifiedRef('ref_shahadat_ali_nahjul', { en: 'Nahjul Balagha' }, {
        scholar: { en: 'Imam Ali (as)' },
        chapter: { en: 'Sermon on his martyrdom' },
      }),
    ],
    items: [
      {
        id: 'shahadat_ali_profile',
        kind: 'masoomeen',
        titleKey: 'islamicCalendarAi.recs.imamAliProfile.title',
        bodyKey: 'islamicCalendarAi.recs.imamAliProfile.body',
        route: 'MasoomeenProfile',
        routeParams: { masoomeenId: 'masoom_ali' },
        priority: 10,
      },
      {
        id: 'shahadat_ali_dua',
        kind: 'dua',
        titleKey: 'islamicCalendarAi.recs.duaTawassul.title',
        bodyKey: 'islamicCalendarAi.recs.duaTawassul.body',
        route: 'DuaReader',
        routeParams: { duaId: 'dua_tawassul' },
        priority: 9,
      },
      {
        id: 'shahadat_ali_ziyarat',
        kind: 'ziyarat',
        titleKey: 'islamicCalendarAi.recs.ziyaratJamia.title',
        bodyKey: 'islamicCalendarAi.recs.ziyaratJamia.body',
        route: 'ZiyaratReader',
        routeParams: { ziyaratId: 'ziyarat_jamia_kabira' },
        priority: 8,
      },
      {
        id: 'shahadat_ali_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.shahadat_ali',
        bodyKey: 'islamicCalendarAi.recs.shahadatAliAmaal.body',
        route: 'Calendar',
        routeParams: { eventId: 'shahadat_imam_ali' },
        priority: 8,
      },
      {
        id: 'shahadat_ali_history',
        kind: 'history',
        titleKey: 'islamicCalendarAi.recs.shahadatAliHistory.title',
        bodyKey: 'islamicCalendarAi.recs.shahadatAliHistory.body',
        route: 'MasoomeenProfile',
        routeParams: { masoomeenId: 'masoom_ali' },
        priority: 7,
      },
    ],
  },
  {
    eventId: 'laylat_qadr',
    significanceKey: 'islamicCalendarAi.events.laylat_qadr.significance',
    references: [
      verifiedRef('ref_laylat_qadr_quran', { en: 'Holy Quran' }, {
        surah: 97,
        contentRef: 'quran:97:1',
      }),
    ],
    items: [
      {
        id: 'qadr_dua',
        kind: 'dua',
        titleKey: 'islamicCalendarAi.recs.duaKumail.title',
        bodyKey: 'islamicCalendarAi.recs.duaKumail.body',
        route: 'DuaReader',
        routeParams: { duaId: 'dua_kumail' },
        priority: 10,
      },
      {
        id: 'qadr_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.qadr',
        bodyKey: 'islamicCalendarAi.recs.qadrAmaal.body',
        route: 'Calendar',
        routeParams: { eventId: 'laylat_qadr' },
        priority: 9,
      },
    ],
  },

  // —— Eid & Dhul Hijjah ——
  {
    eventId: 'eid_fitr',
    significanceKey: 'islamicCalendarAi.events.eid_fitr.significance',
    references: [
      verifiedRef('ref_eid_fitr_quran', { en: 'Holy Quran' }, {
        surah: 2,
        ayah: 185,
        contentRef: 'quran:2:185',
      }),
    ],
    items: [
      {
        id: 'eid_fitr_calendar',
        kind: 'amaal',
        titleKey: 'islamicCalendarAi.recs.eidFitr.title',
        bodyKey: 'islamicCalendarAi.recs.eidFitr.body',
        route: 'Calendar',
        routeParams: { eventId: 'eid_fitr' },
        priority: 8,
      },
    ],
  },
  {
    eventId: 'eid_adha',
    significanceKey: 'islamicCalendarAi.events.eid_adha.significance',
    references: [
      verifiedRef('ref_eid_adha_quran', { en: 'Holy Quran' }, {
        surah: 22,
        ayah: 34,
        contentRef: 'quran:22:34',
      }),
    ],
    items: [
      {
        id: 'eid_adha_calendar',
        kind: 'amaal',
        titleKey: 'islamicCalendarAi.recs.eidAdha.title',
        bodyKey: 'islamicCalendarAi.recs.eidAdha.body',
        route: 'Calendar',
        routeParams: { eventId: 'eid_adha' },
        priority: 8,
      },
    ],
  },
  {
    eventId: 'ghadeer',
    significanceKey: 'islamicCalendarAi.events.ghadeer.significance',
    references: [
      verifiedRef('ref_ghadeer_quran', { en: 'Holy Quran' }, {
        surah: 5,
        ayah: 67,
        contentRef: 'quran:5:67',
      }),
      verifiedRef('ref_ghadeer_kafi', { en: 'Al-Kafi' }, {
        volume: 1,
        hadithNumber: '286',
        scholar: { en: 'Shaykh al-Kulayni' },
      }),
    ],
    items: [
      {
        id: 'ghadeer_dua',
        kind: 'dua',
        titleKey: 'islamicCalendarAi.recs.duaNudba.title',
        bodyKey: 'islamicCalendarAi.recs.duaNudba.body',
        route: 'DuaReader',
        routeParams: { duaId: 'dua_nudba' },
        priority: 9,
      },
      {
        id: 'ghadeer_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.ghadeer',
        bodyKey: 'islamicCalendarAi.recs.ghadeerAmaal.body',
        route: 'Calendar',
        routeParams: { eventId: 'ghadeer' },
        priority: 8,
      },
    ],
  },
  {
    eventId: 'mubahila',
    significanceKey: 'islamicCalendarAi.events.mubahila.significance',
    references: [
      verifiedRef('ref_mubahila_quran', { en: 'Holy Quran' }, {
        surah: 3,
        ayah: 61,
        contentRef: 'quran:3:61',
      }),
    ],
    items: [
      {
        id: 'mubahila_amaal',
        kind: 'amaal',
        titleKey: 'calendar.amaal.mubahila',
        bodyKey: 'islamicCalendarAi.recs.mubahilaAmaal.body',
        route: 'Calendar',
        routeParams: { eventId: 'mubahila' },
        priority: 8,
      },
      {
        id: 'mubahila_history',
        kind: 'history',
        titleKey: 'islamicCalendarAi.recs.mubahilaHistory.title',
        bodyKey: 'islamicCalendarAi.recs.mubahilaHistory.body',
        route: 'Calendar',
        routeParams: { eventId: 'mubahila' },
        priority: 7,
      },
    ],
  },
  {
    eventId: 'wiladat_imam_mahdi',
    significanceKey: 'islamicCalendarAi.events.wiladat_imam_mahdi.significance',
    references: [
      unverifiedRef('ref_mahdi_birth', {
        en: 'Birth date per Shia tradition — sources vary on visibility',
      }),
    ],
    items: [
      {
        id: 'mahdi_profile',
        kind: 'masoomeen',
        titleKey: 'islamicCalendarAi.recs.imamMahdiProfile.title',
        bodyKey: 'islamicCalendarAi.recs.imamMahdiProfile.body',
        route: 'MasoomeenProfile',
        routeParams: { masoomeenId: 'masoom_mahdi' },
        priority: 10,
      },
      {
        id: 'mahdi_dua',
        kind: 'dua',
        titleKey: 'islamicCalendarAi.recs.duaAhad.title',
        bodyKey: 'islamicCalendarAi.recs.duaAhad.body',
        route: 'DuaReader',
        routeParams: { duaId: 'dua_ahad' },
        priority: 9,
      },
    ],
  },
];

const CATALOG_BY_EVENT_ID = new Map(
  EVENT_CONTENT_CATALOG.map((entry) => [entry.eventId, entry]),
);

export function getEventContentSeed(eventId: string): EventContentSeed | undefined {
  return CATALOG_BY_EVENT_ID.get(eventId);
}

export function getAllEventContentSeeds(): EventContentSeed[] {
  return EVENT_CONTENT_CATALOG;
}

export function seedReferencesToCitations(refs: EventReference[]): IslamicSourceCitation[] {
  return refs.map(toCitation);
}

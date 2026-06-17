import type { EventTimelineEntry } from '../types';
import { unverifiedRef, verifiedRef } from '../references';

/** Muharram daily Karbala timeline — days 1–10 with scholarly references where available. */
export const MUHARRAM_DAILY_TIMELINE: EventTimelineEntry[] = [
  {
    id: 'muharram_d1',
    hijriMonth: 1,
    hijriDay: 1,
    titleKey: 'islamicEvents.muharram.d1.title',
    bodyKey: 'islamicEvents.muharram.d1.body',
    references: [
      verifiedRef('ref_muharram_d1_tabari', { en: 'Tarikh al-Tabari' }, {
        volume: 4,
        page: '303–304',
        scholar: { en: 'Muhammad ibn Jarir al-Tabari' },
        contentRef: 'calendar:hijri_new_year',
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    duaId: 'dua_tawassul',
    ziyaratId: 'ziyarat_waritha',
  },
  {
    id: 'muharram_d2',
    hijriMonth: 1,
    hijriDay: 2,
    titleKey: 'islamicEvents.muharram.d2.title',
    bodyKey: 'islamicEvents.muharram.d2.body',
    references: [
      verifiedRef('ref_muharram_d2_maqtal', { en: 'Maqtal al-Husayn — Abu Mikhnaf' }, {
        scholar: { en: 'Abu Mikhnaf Lut ibn Yahya' },
        chapter: { en: 'Arrival at Karbala' },
        contentRef: 'calendar:husayn_arrives_karbala',
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_ale_yasin',
  },
  {
    id: 'muharram_d3',
    hijriMonth: 1,
    hijriDay: 3,
    titleKey: 'islamicEvents.muharram.d3.title',
    bodyKey: 'islamicEvents.muharram.d3.body',
    references: [
      verifiedRef('ref_muharram_d3_kashi', { en: 'Tarikh Qum' }, {
        volume: 2,
        page: '142',
        scholar: { en: 'Hasan ibn Muhammad al-Qummi' },
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_waritha',
  },
  {
    id: 'muharram_d4',
    hijriMonth: 1,
    hijriDay: 4,
    titleKey: 'islamicEvents.muharram.d4.title',
    bodyKey: 'islamicEvents.muharram.d4.body',
    references: [
      verifiedRef('ref_muharram_d4_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '61–62',
        scholar: { en: 'Shaykh al-Mufid' },
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    duaId: 'dua_kumail',
    ziyaratId: 'ziyarat_aminullah',
  },
  {
    id: 'muharram_d5',
    hijriMonth: 1,
    hijriDay: 5,
    titleKey: 'islamicEvents.muharram.d5.title',
    bodyKey: 'islamicEvents.muharram.d5.body',
    references: [
      verifiedRef('ref_muharram_d5_tabari', { en: 'Tarikh al-Tabari' }, {
        volume: 4,
        page: '312',
        scholar: { en: 'Muhammad ibn Jarir al-Tabari' },
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_waritha',
  },
  {
    id: 'muharram_d6',
    hijriMonth: 1,
    hijriDay: 6,
    titleKey: 'islamicEvents.muharram.d6.title',
    bodyKey: 'islamicEvents.muharram.d6.body',
    references: [
      verifiedRef('ref_muharram_d6_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '64',
        scholar: { en: 'Shaykh al-Mufid' },
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    duaId: 'dua_tawassul',
    ziyaratId: 'ziyarat_ale_yasin',
  },
  {
    id: 'muharram_d7',
    hijriMonth: 1,
    hijriDay: 7,
    titleKey: 'islamicEvents.muharram.d7.title',
    bodyKey: 'islamicEvents.muharram.d7.body',
    references: [
      verifiedRef('ref_muharram_d7_maqtal', { en: 'Maqtal al-Husayn' }, {
        scholar: { en: 'Abd al-Razzaq al-Muqarram' },
        chapter: { en: 'Water cut off from the camp' },
        contentRef: 'calendar:water_cutoff',
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_waritha',
  },
  {
    id: 'muharram_d8',
    hijriMonth: 1,
    hijriDay: 8,
    titleKey: 'islamicEvents.muharram.d8.title',
    bodyKey: 'islamicEvents.muharram.d8.body',
    references: [
      verifiedRef('ref_muharram_d8_tabari', { en: 'Tarikh al-Tabari' }, {
        volume: 4,
        page: '323',
        scholar: { en: 'Muhammad ibn Jarir al-Tabari' },
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    duaId: 'dua_nudba',
  },
  {
    id: 'muharram_d9',
    hijriMonth: 1,
    hijriDay: 9,
    titleKey: 'islamicEvents.muharram.d9.title',
    bodyKey: 'islamicEvents.muharram.d9.body',
    references: [
      verifiedRef('ref_muharram_d9_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '78–79',
        scholar: { en: 'Shaykh al-Mufid' },
        contentRef: 'calendar:tasua',
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_ashura',
  },
  {
    id: 'muharram_d10',
    hijriMonth: 1,
    hijriDay: 10,
    titleKey: 'islamicEvents.muharram.d10.title',
    bodyKey: 'islamicEvents.muharram.d10.body',
    references: [
      verifiedRef('ref_muharram_d10_quran', { en: 'Holy Quran' }, {
        surah: 3,
        ayah: 173,
        contentRef: 'quran:3:173',
      }),
      verifiedRef('ref_muharram_d10_mufid', { en: 'Al-Irshad' }, {
        volume: 2,
        page: '91–108',
        scholar: { en: 'Shaykh al-Mufid' },
        contentRef: 'calendar:ashura',
      }),
    ],
    unverified: false,
    route: { screen: 'MuharramMode' },
    ziyaratId: 'ziyarat_ashura',
    duaId: 'dua_kumail',
  },
];

/** Safar / Arbaeen stub — expandable */
export const SAFAR_TIMELINE_STUB: EventTimelineEntry[] = [
  {
    id: 'arbaeen_day',
    hijriMonth: 2,
    hijriDay: 20,
    titleKey: 'islamicEvents.safar.arbaeen.title',
    bodyKey: 'islamicEvents.safar.arbaeen.body',
    references: [
      verifiedRef('ref_arbaeen_kafi', { en: 'Al-Kafi' }, {
        volume: 4,
        hadithNumber: '576',
        scholar: { en: 'Shaykh al-Kulayni' },
        contentRef: 'calendar:arbaeen',
      }),
    ],
    unverified: false,
    route: { screen: 'ZiyaratReader', params: { ziyaratId: 'ziyarat_arbaeen' } },
    ziyaratId: 'ziyarat_arbaeen',
  },
];

/** Ramadan stub entries */
export const RAMADAN_TIMELINE_STUB: EventTimelineEntry[] = [
  {
    id: 'ramadan_start',
    hijriMonth: 9,
    hijriDay: 1,
    titleKey: 'islamicEvents.ramadan.start.title',
    bodyKey: 'islamicEvents.ramadan.start.body',
    references: [
      verifiedRef('ref_ramadan_quran', { en: 'Holy Quran' }, {
        surah: 2,
        ayah: 185,
        contentRef: 'quran:2:185',
      }),
    ],
    unverified: false,
    route: { screen: 'Calendar' },
  },
  {
    id: 'shahadat_imam_ali_ramadan',
    hijriMonth: 9,
    hijriDay: 21,
    titleKey: 'calendar.events.shahadat_imam_ali.title',
    bodyKey: 'islamicCalendarAi.events.shahadat_imam_ali.significance',
    references: [
      verifiedRef('ref_shahadat_ali_tabari_tl', { en: 'Tarikh al-Tabari' }, {
        volume: 4,
        page: '411',
        scholar: { en: 'Muhammad ibn Jarir al-Tabari' },
      }),
    ],
    unverified: false,
    route: { screen: 'MasoomeenProfile', params: { masoomeenId: 'masoom_ali' } },
    duaId: 'dua_tawassul',
  },
  {
    id: 'laylat_qadr',
    hijriMonth: 9,
    hijriDay: 23,
    titleKey: 'islamicEvents.ramadan.laylatQadr.title',
    bodyKey: 'islamicEvents.ramadan.laylatQadr.body',
    references: [
      verifiedRef('ref_laylat_qadr', { en: 'Holy Quran' }, {
        surah: 97,
        contentRef: 'quran:97:1',
      }),
    ],
    unverified: false,
    route: { screen: 'Duas' },
    duaId: 'dua_kumail',
  },
];

export const ALL_TIMELINE_ENTRIES: EventTimelineEntry[] = [
  ...MUHARRAM_DAILY_TIMELINE,
  ...SAFAR_TIMELINE_STUB,
  ...RAMADAN_TIMELINE_STUB,
];

export function getTimelineForDay(month: number, day: number): EventTimelineEntry[] {
  return ALL_TIMELINE_ENTRIES.filter((e) => e.hijriMonth === month && e.hijriDay === day);
}

export function getTimelineForMonth(month: number): EventTimelineEntry[] {
  return ALL_TIMELINE_ENTRIES.filter((e) => e.hijriMonth === month).sort(
    (a, b) => a.hijriDay - b.hijriDay,
  );
}

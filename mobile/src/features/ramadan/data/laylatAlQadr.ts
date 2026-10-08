import { RAMADAN_SOURCES } from './citations';
import type { LaylatAlQadrNight } from '../types';

const { quranQadr, bihar, mafatih, sahifa, wasail, kamil, manLa } = RAMADAN_SOURCES;

export const LAYLAT_AL_QADR_NIGHTS: LaylatAlQadrNight[] = [
  {
    ramadanDay: 19,
    title: { en: '19 Ramadan — first candidate night' },
    narrative: {
      en: 'Some traditions begin seeking Laylat al-Qadr from the 19th night. Increase worship from tonight.',
    },
    emphasized: false,
    sahifaId: 'sahifa_051',
    citations: [bihar, { ...mafatih, note: 'Some maraji begin from 19th' }],
    amaal: [
      {
        title: { en: 'Perform ghusl before Maghrib' },
        body: { en: 'Prepare spiritually for the night — many recommend ghusl before evening worship.' },
        citations: [mafatih, wasail],
      },
    ],
  },
  {
    ramadanDay: 21,
    title: { en: '21 Ramadan — odd night' },
    narrative: {
      en: 'The first of the widely emphasized odd nights in the last ten days. Dedicate tonight to Quran and dua.',
    },
    emphasized: true,
    sahifaId: 'sahifa_051',
    duaIds: ['dua_kumail'],
    citations: [manLa, bihar],
    amaal: [
      {
        title: { en: 'Recite Dua al-Qadr from Sahifa' },
        body: { en: 'Supplication #51 of al-Sahifa al-Sajjadiyya — the classic dua for this night.' },
        citations: [sahifa, mafatih],
      },
      {
        title: { en: '100 times: Astaghfirullah' },
        body: { en: 'Seek forgiveness repeatedly — a recommended amal for Laylat al-Qadr.' },
        citations: [mafatih, wasail],
      },
    ],
  },
  {
    ramadanDay: 23,
    title: { en: '23 Ramadan — highly emphasized' },
    narrative: {
      en: 'Many scholars highlight the 23rd night as among the strongest candidates for Laylat al-Qadr.',
    },
    emphasized: true,
    sahifaId: 'sahifa_051',
    citations: [bihar, mafatih],
    amaal: [
      {
        title: { en: 'Complete Quran khatm if possible' },
        body: { en: 'Finishing the Quran on an odd night is a beloved tradition among many believers.' },
        citations: [mafatih, quranQadr],
      },
      {
        title: { en: 'Ziyarat of Imam Husayn (as)' },
        body: { en: 'Recite Ziyarat Ashura or Warith with reflection tonight.' },
        citations: [kamil, mafatih],
      },
    ],
  },
  {
    ramadanDay: 25,
    title: { en: '25 Ramadan — odd night' },
    narrative: {
      en: 'Continue the search with patience — each odd night carries immense reward.',
    },
    emphasized: true,
    sahifaId: 'sahifa_051',
    citations: [manLa, bihar],
    amaal: [
      {
        title: { en: 'Night prayer (Qiyam)' },
        body: { en: 'Pray at least two rak‘at with long qunut — many recite Surah al-Qadr in each rak‘ah.' },
        citations: [wasail, quranQadr],
      },
    ],
  },
  {
    ramadanDay: 27,
    title: { en: '27 Ramadan — most popular candidate' },
    narrative: {
      en: 'The 27th night is the most commonly observed candidate for Laylat al-Qadr across the Muslim world.',
    },
    emphasized: true,
    sahifaId: 'sahifa_051',
    citations: [bihar, mafatih],
    amaal: [
      {
        title: { en: 'Dua Kumayl after Maghrib' },
        body: { en: 'Many communities gather for Dua Kumayl on the 27th night of Ramadan.' },
        citations: [mafatih, kamil],
      },
      {
        title: { en: 'Charity before dawn' },
        body: { en: 'Give sadaqah before Fajr — charity on Laylat al-Qadr is especially multiplied.' },
        citations: [quranQadr, wasail],
      },
    ],
  },
  {
    ramadanDay: 29,
    title: { en: '29 Ramadan — final odd night' },
    narrative: {
      en: 'The last odd night of Ramadan. Pour your heart into worship — the month’s crescendo.',
    },
    emphasized: true,
    sahifaId: 'sahifa_051',
    citations: [bihar, sahifa],
    amaal: [
      {
        title: { en: 'Pay Zakat al-Fitr intentions' },
        body: { en: 'Set aside zakat al-fitr for each member of your household before Eid prayer.' },
        citations: [wasail, mafatih],
      },
      {
        title: { en: 'Farewell Ramadan dua' },
        body: { en: 'Ask Allah to accept your fasts and grant you many more Ramadans.' },
        citations: [mafatih, bihar],
      },
    ],
  },
];

export const LAYLAT_BY_DAY: Record<number, LaylatAlQadrNight> = Object.fromEntries(
  LAYLAT_AL_QADR_NIGHTS.map((n) => [n.ramadanDay, n]),
);

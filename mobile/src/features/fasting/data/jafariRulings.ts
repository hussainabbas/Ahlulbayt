import type { IslamicCitation } from '../types';

export const FIDYA_DEFAULT_GRAMS_PER_DAY = 750;

export interface JafariRulingSnippet {
  id: string;
  summaryKey: string;
  detailKey: string;
  quantity?: number;
  unitKey?: string;
  citations: IslamicCitation[];
  unverified: boolean;
}

const sistaniIslamicLaws: IslamicCitation = {
  id: 'fiqh_sistani_islamic_laws_fasting',
  kind: 'fiqh',
  primarySource: {
    en: 'Islamic Laws — Sayyid Ali al-Sistani',
    ar: 'القوانين الإسلامية — السيد علي السيستاني',
    ur: 'اسلامی قوانین — سید علی سیستانی',
  },
  chapter: {
    en: 'Fasting — Kaffara & Fidya',
    ar: 'الصيام — الكفارة والفدية',
    ur: 'روزے — کفارہ و فدیہ',
  },
  marja: 'sistani',
  verification: 'pending',
  notes: {
    en: 'Summary aligned with widely circulated English translation; verify current ruling with your marja.',
  },
};

const khameneiResalah: IslamicCitation = {
  id: 'fiqh_khamenei_resalah_fasting',
  kind: 'fiqh',
  primarySource: {
    en: 'Islamic Laws — Ayatollah Khamenei',
    ar: 'الرسالة العملية — آية الله الخامنئي',
    ur: 'رسالہ عملی — آیت اللہ خامنہ ای',
  },
  chapter: {
    en: 'Fasting obligations',
    ar: 'أحكام الصيام',
    ur: 'احکام روزہ',
  },
  marja: 'khamenei',
  verification: 'pending',
  notes: {
    en: 'General principles; consult latest resalah for your case.',
  },
};

const manhajSalihin: IslamicCitation = {
  id: 'fiqh_manhaj_salihin_fasting',
  kind: 'book',
  primarySource: {
    en: 'Manhaj al-Salihin — Summary',
    ar: 'منهاج الصالحين — ملخص',
    ur: 'منہاج الصالحین — خلاصہ',
  },
  scholar: {
    en: 'Ayatollah Sayyid Muhammad Sadiq al-Shirazi',
  },
  verification: 'pending',
  notes: {
    en: 'Educational summary reference; not a substitute for marja guidance.',
  },
};

const quranBaqarah: IslamicCitation = {
  id: 'quran_2_183_185',
  kind: 'quran',
  primarySource: { en: 'Holy Quran' },
  surah: 2,
  ayah: 183,
  ayahEnd: 185,
  verification: 'verified',
};

export const KAFFARA_CITATIONS: IslamicCitation[] = [
  quranBaqarah,
  sistaniIslamicLaws,
  khameneiResalah,
];

export const FIDYA_CITATIONS: IslamicCitation[] = [
  quranBaqarah,
  sistaniIslamicLaws,
  manhajSalihin,
];

export const KAFFARA_RULES: Record<string, JafariRulingSnippet> = {
  forgetful: {
    id: 'kaffara_forgetful',
    summaryKey: 'fasting.kaffara.rules.forgetful.summary',
    detailKey: 'fasting.kaffara.rules.forgetful.detail',
    citations: [sistaniIslamicLaws, khameneiResalah],
    unverified: false,
  },
  coerced: {
    id: 'kaffara_coerced',
    summaryKey: 'fasting.kaffara.rules.coerced.summary',
    detailKey: 'fasting.kaffara.rules.coerced.detail',
    citations: [sistaniIslamicLaws],
    unverified: true,
  },
  nonRamadan: {
    id: 'kaffara_non_ramadan',
    summaryKey: 'fasting.kaffara.rules.nonRamadan.summary',
    detailKey: 'fasting.kaffara.rules.nonRamadan.detail',
    citations: [sistaniIslamicLaws],
    unverified: true,
  },
  ramadanIntentionalFast60: {
    id: 'kaffara_fast_60',
    summaryKey: 'fasting.kaffara.rules.fast60.summary',
    detailKey: 'fasting.kaffara.rules.fast60.detail',
    quantity: 60,
    unitKey: 'fasting.units.consecutiveDays',
    citations: [sistaniIslamicLaws, khameneiResalah],
    unverified: true,
  },
  ramadanIntentionalFeed60: {
    id: 'kaffara_feed_60',
    summaryKey: 'fasting.kaffara.rules.feed60.summary',
    detailKey: 'fasting.kaffara.rules.feed60.detail',
    quantity: 60,
    unitKey: 'fasting.units.poorPersons',
    citations: [sistaniIslamicLaws],
    unverified: true,
  },
  sistaniNote: {
    id: 'kaffara_sistani_note',
    summaryKey: 'fasting.kaffara.rules.sistaniNote.summary',
    detailKey: 'fasting.kaffara.rules.sistaniNote.detail',
    citations: [sistaniIslamicLaws],
    unverified: true,
  },
  khameneiNote: {
    id: 'kaffara_khamenei_note',
    summaryKey: 'fasting.kaffara.rules.khameneiNote.summary',
    detailKey: 'fasting.kaffara.rules.khameneiNote.detail',
    citations: [khameneiResalah],
    unverified: true,
  },
};

export const SEHRI_IFTAR_RULINGS: JafariRulingSnippet[] = [
  {
    id: 'sehri_imsak',
    summaryKey: 'fasting.rulings.sehri.summary',
    detailKey: 'fasting.rulings.sehri.detail',
    citations: [sistaniIslamicLaws, khameneiResalah],
    unverified: false,
  },
  {
    id: 'iftar_maghrib',
    summaryKey: 'fasting.rulings.iftar.summary',
    detailKey: 'fasting.rulings.iftar.detail',
    citations: [sistaniIslamicLaws],
    unverified: false,
  },
];

export const QADA_RULINGS: JafariRulingSnippet[] = [
  {
    id: 'qada_missed',
    summaryKey: 'fasting.rulings.qada.summary',
    detailKey: 'fasting.rulings.qada.detail',
    citations: [sistaniIslamicLaws, manhajSalihin],
    unverified: true,
  },
];

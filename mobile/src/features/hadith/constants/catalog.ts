import type { HadithGrading, HadithSource, HadithSourceMeta, HadithTopic } from '../types';

export const HADITH_SOURCES: HadithSourceMeta[] = [
  {
    id: 'kafi',
    category: 'shia_core',
    nameKey: 'hadith.sources.kafi',
    descriptionKey: 'hadith.sources.kafiDesc',
    icon: '📚',
    accentColor: '#5A6A8A',
    estimatedTotal: 16000,
    corpusTier: 1,
    available: true,
  },
  {
    id: 'faqih',
    category: 'shia_core',
    nameKey: 'hadith.sources.faqih',
    descriptionKey: 'hadith.sources.faqihDesc',
    icon: '📖',
    accentColor: '#4A6080',
    estimatedTotal: 6000,
    corpusTier: 1,
    available: false,
  },
  {
    id: 'tahdhib',
    category: 'shia_core',
    nameKey: 'hadith.sources.tahdhib',
    descriptionKey: 'hadith.sources.tahdhibDesc',
    icon: '📕',
    accentColor: '#6A5A7A',
    estimatedTotal: 4000,
    corpusTier: 1,
    available: false,
  },
  {
    id: 'istibsar',
    category: 'shia_core',
    nameKey: 'hadith.sources.istibsar',
    descriptionKey: 'hadith.sources.istibsarDesc',
    icon: '🔍',
    accentColor: '#5A7070',
    estimatedTotal: 5500,
    corpusTier: 1,
    available: false,
  },
  {
    id: 'bihar',
    category: 'shia_core',
    nameKey: 'hadith.sources.bihar',
    descriptionKey: 'hadith.sources.biharDesc',
    icon: '🌊',
    accentColor: '#4A7A6A',
    estimatedTotal: 50000,
    corpusTier: 2,
    available: true,
  },
  {
    id: 'nahjul',
    category: 'shia_derived',
    nameKey: 'hadith.sources.nahjul',
    descriptionKey: 'hadith.sources.nahjulDesc',
    icon: '📜',
    accentColor: '#3D9B8A',
    estimatedTotal: 3000,
    corpusTier: 0,
    available: true,
  },
  {
    id: 'sahifa',
    category: 'shia_derived',
    nameKey: 'hadith.sources.sahifa',
    descriptionKey: 'hadith.sources.sahifaDesc',
    icon: '🤲',
    accentColor: '#4A8A7A',
    estimatedTotal: 200,
    corpusTier: 0,
    available: false,
  },
  {
    id: 'bukhari',
    category: 'sunni_cross_ref',
    nameKey: 'hadith.sources.bukhari',
    descriptionKey: 'hadith.sources.bukhariDesc',
    icon: '☪️',
    accentColor: '#8A7A5A',
    estimatedTotal: 7500,
    corpusTier: 2,
    available: false,
  },
  {
    id: 'muslim',
    category: 'sunni_cross_ref',
    nameKey: 'hadith.sources.muslim',
    descriptionKey: 'hadith.sources.muslimDesc',
    icon: '☪️',
    accentColor: '#7A6A5A',
    estimatedTotal: 7500,
    corpusTier: 2,
    available: false,
  },
  {
    id: 'abudawud',
    category: 'sunni_cross_ref',
    nameKey: 'hadith.sources.abudawud',
    descriptionKey: 'hadith.sources.abudawudDesc',
    icon: '☪️',
    accentColor: '#6A7A6A',
    estimatedTotal: 4800,
    corpusTier: 2,
    available: false,
  },
  {
    id: 'tirmidhi',
    category: 'sunni_cross_ref',
    nameKey: 'hadith.sources.tirmidhi',
    descriptionKey: 'hadith.sources.tirmidhiDesc',
    icon: '☪️',
    accentColor: '#6A6A7A',
    estimatedTotal: 4000,
    corpusTier: 2,
    available: false,
  },
];

export const SHIA_SOURCES = HADITH_SOURCES.filter((s) => s.category !== 'sunni_cross_ref');
export const SUNNI_CROSS_REF_SOURCES = HADITH_SOURCES.filter((s) => s.category === 'sunni_cross_ref');

export const HADITH_TOPICS: Array<{ id: HadithTopic; labelKey: string; icon: string }> = [
  { id: 'ethics', labelKey: 'hadith.topics.ethics', icon: '💎' },
  { id: 'worship', labelKey: 'hadith.topics.worship', icon: '🕌' },
  { id: 'imamate', labelKey: 'hadith.topics.imamate', icon: '⭐' },
  { id: 'knowledge', labelKey: 'hadith.topics.knowledge', icon: '📖' },
  { id: 'patience', labelKey: 'hadith.topics.patience', icon: '🕊️' },
  { id: 'family', labelKey: 'hadith.topics.family', icon: '👨‍👩‍👧' },
  { id: 'justice', labelKey: 'hadith.topics.justice', icon: '⚖️' },
  { id: 'dua', labelKey: 'hadith.topics.dua', icon: '🤲' },
  { id: 'karbala', labelKey: 'hadith.topics.karbala', icon: '🏴' },
  { id: 'taqwa', labelKey: 'hadith.topics.taqwa', icon: '🌙' },
  { id: 'fiqh', labelKey: 'hadith.topics.fiqh', icon: '📋' },
  { id: 'tawhid', labelKey: 'hadith.topics.tawhid', icon: '✨' },
  { id: 'akhira', labelKey: 'hadith.topics.akhira', icon: '🌟' },
];

export const GRADING_LABEL_KEYS: Record<HadithGrading, string> = {
  sahih: 'hadith.grading.sahih',
  hasan: 'hadith.grading.hasan',
  muwaththaq: 'hadith.grading.muwaththaq',
  daif: 'hadith.grading.daif',
  mawdu: 'hadith.grading.mawdu',
  unknown: 'hadith.grading.unknown',
};

export const SOURCE_BY_ID = Object.fromEntries(HADITH_SOURCES.map((s) => [s.id, s])) as Record<
  HadithSource,
  HadithSourceMeta
>;

export const CORPUS_ESTIMATED_TOTAL = HADITH_SOURCES.reduce((sum, s) => sum + s.estimatedTotal, 0);

export const BUNDLED_SOURCE_COUNT = HADITH_SOURCES.filter((s) => s.available).length;

import type { HadithSource, HadithSourceMeta, HadithTopic } from '../types';

export const HADITH_SOURCES: HadithSourceMeta[] = [
  {
    id: 'nahjul',
    nameKey: 'hadith.sources.nahjul',
    descriptionKey: 'hadith.sources.nahjulDesc',
    icon: '📜',
    accentColor: '#3D9B8A',
  },
  {
    id: 'kafi',
    nameKey: 'hadith.sources.kafi',
    descriptionKey: 'hadith.sources.kafiDesc',
    icon: '📚',
    accentColor: '#5A6A8A',
  },
  {
    id: 'bihar',
    nameKey: 'hadith.sources.bihar',
    descriptionKey: 'hadith.sources.biharDesc',
    icon: '🌊',
    accentColor: '#4A7A6A',
  },
];

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
];

export const SOURCE_BY_ID = Object.fromEntries(HADITH_SOURCES.map((s) => [s.id, s])) as Record<
  HadithSource,
  HadithSourceMeta
>;

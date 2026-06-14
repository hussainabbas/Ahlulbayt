import type { SupportedLocale } from '@/core/config/constants';

import { HadithRepository } from './hadithRepository';
import type { HadithEntry, HadithId, HadithTopic, LocalizedText } from '../types';
import { pickLocalized } from '../utils/localize';

const TOPIC_KEYWORDS: Record<HadithTopic, string[]> = {
  ethics: ['character', 'kindness', 'truth', 'trust', 'اخلاق', 'سچ'],
  worship: ['prayer', 'worship', 'salat', 'عبادت', 'نماز'],
  imamate: ['imam', 'wilayah', 'mawla', 'امام', 'ولایت'],
  knowledge: ['knowledge', 'learn', 'علم', 'حکمت'],
  patience: ['patience', 'sabr', 'صبر', 'persever'],
  family: ['parent', 'mother', 'family', 'والدین', 'خاندان'],
  justice: ['justice', 'fair', 'عدل', 'انصاف'],
  dua: ['dua', 'supplication', 'دعا', 'pray'],
  karbala: ['karbala', 'husayn', 'ashura', 'کربلا', 'حسین'],
  taqwa: ['taqwa', 'sin', 'heart', 'تقوی', 'گناہ'],
};

function extractKeyThemes(entry: HadithEntry, locale: SupportedLocale): string[] {
  const text = pickLocalized(entry.text, locale).toLowerCase();
  const themes: string[] = [];

  for (const topic of entry.topics) {
    themes.push(topic);
  }

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      if (!themes.includes(topic)) themes.push(topic);
    }
  }

  return themes.slice(0, 4);
}

export interface HadithAiSummary {
  summary: LocalizedText;
  keyThemes: HadithTopic[];
  generatedAt: string;
  mode: 'bundled' | 'generated';
}

export function generateHadithSummary(
  entry: HadithEntry,
  _locale: SupportedLocale = 'en',
): HadithAiSummary {
  return {
    summary: entry.summary,
    keyThemes: entry.topics,
    generatedAt: new Date().toISOString(),
    mode: 'bundled',
  };
}

export function generateEnhancedSummary(
  entry: HadithEntry,
  locale: SupportedLocale,
): HadithAiSummary {
  const themes = extractKeyThemes(entry, locale);
  const base = pickLocalized(entry.summary, locale);
  const speaker = entry.speaker ? pickLocalized(entry.speaker, locale) : null;
  const ref = entry.reference.hadithNumber ?? '';
  const vol = entry.reference.volume ? `Vol. ${entry.reference.volume}` : '';

  const en = `${base}${speaker ? ` Narrated from ${speaker}.` : ''}${vol || ref ? ` [${[vol, ref ? `#${ref}` : ''].filter(Boolean).join(', ')}]` : ''}`;
  const ur = `${pickLocalized(entry.summary, 'ur')}${speaker ? ` — ${pickLocalized(entry.speaker!, 'ur')} سے روایت۔` : ''}`;
  const ar = `${pickLocalized(entry.summary, 'ar')}${speaker ? ` — رواية من ${pickLocalized(entry.speaker!, 'ar')}.` : ''}`;

  return {
    summary: { en, ur, ar },
    keyThemes: themes as HadithTopic[],
    generatedAt: new Date().toISOString(),
    mode: 'generated',
  };
}

export function getHadithSummary(id: HadithId, locale: SupportedLocale = 'en'): HadithAiSummary | null {
  const entry = HadithRepository.getEntry(id);
  if (!entry) return null;
  return generateEnhancedSummary(entry, locale);
}

export function getTopicAiSummary(topic: HadithTopic): LocalizedText | null {
  const summaries = HadithRepository.getTopicSummaries();
  const found = summaries.find((s) => s.topic === topic);
  return found?.summary ?? null;
}

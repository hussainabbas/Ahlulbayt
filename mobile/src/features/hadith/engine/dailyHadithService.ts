import { BUNDLED_HADITHS } from '../data/bundled';
import type { DailyHadithPayload } from '../types';
import { pickLocalized } from '../utils/localize';

function dateSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function getDailyHadith(date = new Date()): DailyHadithPayload {
  const idx = dateSeed(date) % BUNDLED_HADITHS.length;
  const entry = BUNDLED_HADITHS[idx]!;

  const refParts: string[] = [];
  if (entry.reference.volume) refParts.push(`Vol ${entry.reference.volume}`);
  if (entry.reference.hadithNumber) refParts.push(`#${entry.reference.hadithNumber}`);

  return {
    hadithId: entry.id,
    title: entry.title,
    text: entry.text,
    arabic: entry.arabic,
    source: entry.source,
    referenceLabel: {
      en: refParts.join(' · ') || entry.source,
      ur: refParts.join(' · ') || entry.source,
      ar: refParts.join(' · ') || entry.source,
    },
  };
}

export function getDailyHadithForHome(date = new Date(), locale = 'en') {
  const daily = getDailyHadith(date);
  return {
    hadithId: daily.hadithId,
    text: pickLocalized(daily.text, locale),
    narrator: pickLocalized(daily.title, locale),
    source: `${daily.source}${daily.referenceLabel.en ? ` · ${daily.referenceLabel.en}` : ''}`,
  };
}

import { isGeneratedCorpusReady } from '../data/bundled';
import { SURAH_METADATA } from '../constants/surahMetadata';
import { QuranRepository } from './quranRepository';
import type { SearchResult, TranslationLayer } from '../types';

/**
 * Search-only folding (never applied to displayed text): strips harakat and
 * Quranic annotation marks and folds alif forms, so a query typed on a normal
 * keyboard ("الله") matches the Uthmani spelling ("ٱللَّهِ").
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0671\u0622\u0623\u0625]/g, '\u0627')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Snippets only — never truncate full Arabic in the reader UI. */
function snippet(text: string, query: string, maxLen = 80): string {
  const idx = normalize(text).indexOf(normalize(query));
  if (idx < 0) return text.slice(0, maxLen);
  const start = Math.max(0, idx - 20);
  return (start > 0 ? '…' : '') + text.slice(start, start + maxLen) + (start + maxLen < text.length ? '…' : '');
}

export class QuranSearchIndex {
  static isOfflineCorpusReady(): boolean {
    return isGeneratedCorpusReady() || QuranRepository.getAllIndexedAyahs().length > 0;
  }

  static search(query: string, limit = 30): SearchResult[] {
    const q = normalize(query);
    if (q.length < 2) return [];

    const results: SearchResult[] = [];

    for (const meta of SURAH_METADATA) {
      const haystack = normalize(
        `${meta.nameEnglish} ${meta.nameArabic} ${meta.nameUrdu} ${meta.nameTransliteration}`,
      );
      if (haystack.includes(q)) {
        results.push({
          ref: `${meta.number}:1`,
          surah: meta.number,
          ayah: 1,
          surahName: meta.nameEnglish,
          snippetArabic: meta.nameArabic,
          snippetTranslation: meta.nameEnglish,
          matchField: 'surah_name',
        });
      }
    }

    const indexedAyahs = QuranRepository.getAllIndexedAyahs();
    for (const ayah of indexedAyahs) {
      const meta = SURAH_METADATA.find((s) => s.number === ayah.surah);
      const arabicNorm = normalize(ayah.arabic);
      if (arabicNorm.includes(q)) {
        results.push({
          ref: `${ayah.surah}:${ayah.ayah}`,
          surah: ayah.surah,
          ayah: ayah.ayah,
          surahName: meta?.nameEnglish ?? '',
          snippetArabic: snippet(ayah.arabic, query),
          matchField: 'arabic',
        });
        continue;
      }

      const layers: TranslationLayer[] = ['en', 'ur', 'roman_ur'];
      for (const layer of layers) {
        const text = ayah.translations[layer];
        if (text && normalize(text).includes(q)) {
          results.push({
            ref: `${ayah.surah}:${ayah.ayah}`,
            surah: ayah.surah,
            ayah: ayah.ayah,
            surahName: meta?.nameEnglish ?? '',
            snippetArabic: ayah.arabic,
            snippetTranslation: snippet(text, query),
            matchField: 'translation',
          });
          break;
        }
      }
    }

    const seen = new Set<string>();
    return results
      .filter((r) => {
        if (seen.has(r.ref)) return false;
        seen.add(r.ref);
        return true;
      })
      .slice(0, limit);
  }
}

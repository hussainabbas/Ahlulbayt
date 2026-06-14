import { DuaRepository } from '@/features/dua/engine/duaRepository';
import type { DuaId } from '@/features/dua/types';
import { ZiyaratRepository } from '@/features/ziyarat/engine/ziyaratRepository';
import type { ZiyaratId } from '@/features/ziyarat/types';

import { MAFATIH_INDEX } from '../constants/index';
import { MafatihRepository } from './mafatihRepository';
import type { MafatihRef, MafatihSearchResult } from '../types';
import { parseMafatihRef } from '../types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim();
}

function snippet(text: string, query: string, maxLen = 80): string {
  const idx = normalize(text).indexOf(normalize(query));
  if (idx < 0) return text.slice(0, maxLen) + (text.length > maxLen ? '…' : '');
  const start = Math.max(0, idx - 20);
  return (start > 0 ? '…' : '') + text.slice(start, start + maxLen) + '…';
}

function scoreEntry(
  searchText: string,
  title: string,
  query: string,
  mafatihRef: string,
): number {
  const q = normalize(query);
  if (q.length < 2) return 0;

  let score = 0;
  if (normalize(title).includes(q)) score += 0.5;
  if (normalize(searchText).includes(q)) score += 0.35;
  if (mafatihRef.includes(q)) score += 0.25;

  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  for (const token of tokens) {
    if (normalize(searchText).includes(token)) score += 0.15;
  }

  return Math.min(1, score);
}

export class MafatihSearchIndex {
  static search(query: string, limit = 30): MafatihSearchResult[] {
    const q = query.trim();
    if (q.length < 2) return [];

    const results: MafatihSearchResult[] = [];

    for (const entry of MAFATIH_INDEX) {
      const titleScore = scoreEntry(entry.searchText, entry.titles.en, q, entry.mafatihRef);
      if (titleScore < 0.15) continue;

      results.push({
        ref: entry.ref,
        title: entry.titles.en,
        snippet: snippet(entry.description.en, q),
        kind: entry.kind,
        mafatihRef: entry.mafatihRef,
        score: titleScore,
      });
    }

    // Search inside bundled section text
    for (const entry of MAFATIH_INDEX) {
      const bundle = MafatihRepository.getBundle(entry.ref);
      if (!bundle) continue;

      for (const section of bundle.sections) {
        const haystack = [section.arabic, section.translations.en, section.translations.ur]
          .filter(Boolean)
          .join(' ');
        if (!normalize(haystack).includes(normalize(q))) continue;

        const existing = results.find((r) => r.ref === entry.ref);
        const bodyScore = 0.4;
        if (existing) {
          existing.score = Math.max(existing.score, bodyScore);
          existing.snippet = snippet(haystack, q, 100);
        } else {
          results.push({
            ref: entry.ref,
            title: entry.titles.en,
            snippet: snippet(haystack, q, 100),
            kind: entry.kind,
            mafatihRef: entry.mafatihRef,
            score: bodyScore,
          });
        }
        break;
      }
    }

    const seen = new Set<string>();
    return results
      .filter((r) => {
        if (seen.has(r.ref)) return false;
        seen.add(r.ref);
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /** Build extended search corpus (for future FTS5 sync). */
  static buildCorpusDocument(ref: MafatihRef): string | null {
    const bundle = MafatihRepository.getBundle(ref);
    if (!bundle) return null;
    return bundle.sections
      .map((s) => [s.arabic, s.translations.en, s.translations.ur].filter(Boolean).join('\n'))
      .join('\n\n');
  }

  static listOfflineRefs(): MafatihRef[] {
    return MAFATIH_INDEX.filter((e) => {
      const { kind, contentId } = parseMafatihRef(e.ref);
      if (kind === 'dua') return DuaRepository.isAvailable(contentId as DuaId);
      if (kind === 'ziyarat') return ZiyaratRepository.isAvailable(contentId as ZiyaratId);
      return false;
    }).map((e) => e.ref);
  }
}

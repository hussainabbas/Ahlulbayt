import type { HadithEntry, HadithId, HadithRelatedResult } from '../types';

function topicOverlap(a: HadithEntry, b: HadithEntry): number {
  const setA = new Set(a.topics);
  let overlap = 0;
  for (const t of b.topics) {
    if (setA.has(t)) overlap += 1;
  }
  const union = new Set([...a.topics, ...b.topics]).size;
  return union === 0 ? 0 : overlap / union;
}

function narratorOverlap(a: HadithEntry, b: HadithEntry): number {
  const narrA = new Set((a.reference.narrators ?? []).map((n) => n.en.toLowerCase()));
  if (narrA.size === 0) return 0;
  let overlap = 0;
  for (const n of b.reference.narrators ?? []) {
    if (narrA.has(n.en.toLowerCase())) overlap += 1;
  }
  return overlap / narrA.size;
}

export function getRelatedHadiths(
  entry: HadithEntry,
  corpus: HadithEntry[],
  byId: Record<string, HadithEntry>,
  limit = 6,
): HadithRelatedResult[] {
  const scored = new Map<HadithId, HadithRelatedResult>();

  for (const rid of entry.relatedIds ?? []) {
    const rel = byId[rid];
    if (rel) {
      scored.set(rel.id, { entry: rel, score: 1, reason: 'explicit' });
    }
  }

  for (const candidate of corpus) {
    if (candidate.id === entry.id) continue;
    if (scored.has(candidate.id)) continue;

    const topicScore = topicOverlap(entry, candidate);
    if (topicScore >= 0.34) {
      scored.set(candidate.id, {
        entry: candidate,
        score: 0.5 + topicScore * 0.4,
        reason: 'topic',
      });
      continue;
    }

    const narrScore = narratorOverlap(entry, candidate);
    if (narrScore > 0) {
      scored.set(candidate.id, {
        entry: candidate,
        score: 0.35 + narrScore * 0.3,
        reason: 'narrator',
      });
      continue;
    }

    if (candidate.source === entry.source && topicScore > 0) {
      scored.set(candidate.id, {
        entry: candidate,
        score: 0.25 + topicScore * 0.2,
        reason: 'source',
      });
    }
  }

  return [...scored.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}

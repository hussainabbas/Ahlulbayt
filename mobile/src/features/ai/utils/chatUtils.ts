import type { AiCitationKind } from '../types';

const QURAN_PATTERN = /\bquran\b|\bsurah\b|\b\d+:\d+/i;
const HADITH_PATTERN = /\bhadith\b|\bkafi\b|\bnahjul\b|\bbihar\b|\bmaqtal\b/i;

export function inferCitationKind(citation: {
  title: string;
  source?: string;
  kind?: AiCitationKind;
}): AiCitationKind {
  if (citation.kind) return citation.kind;
  const haystack = `${citation.title} ${citation.source ?? ''}`;
  if (QURAN_PATTERN.test(haystack)) return 'quran';
  if (HADITH_PATTERN.test(haystack)) return 'hadith';
  if (citation.source) return 'book';
  return 'general';
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Reveals assistant text word-by-word for a natural streaming feel. */
export async function streamAssistantText(
  fullText: string,
  onChunk: (partial: string) => void,
  chunkDelayMs = 16,
): Promise<void> {
  const parts = fullText.match(/\S+\s*/g) ?? [fullText];
  let acc = '';
  for (const part of parts) {
    acc += part;
    onChunk(acc);
    await sleep(chunkDelayMs);
  }
}

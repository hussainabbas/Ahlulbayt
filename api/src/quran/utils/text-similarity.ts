const STOP_WORDS = new Set([
  'a', 'an', 'the', 'about', 'find', 'verses', 'verse', 'surah', 'ayah', 'in', 'on', 'of',
  'for', 'and', 'or', 'to', 'is', 'are', 'me', 'show', 'give', 'what', 'does', 'quran', 'say',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function expandQuery(query: string, synonymGroups: string[][]): string[] {
  const tokens = new Set(tokenize(query));
  const qNorm = query.toLowerCase();

  for (const group of synonymGroups) {
    const hit = group.some((term) => qNorm.includes(term.toLowerCase()) || tokens.has(term.toLowerCase()));
    if (hit) {
      for (const term of group) tokens.add(term.toLowerCase());
    }
  }

  return [...tokens];
}

export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, freqA] of a) {
    normA += freqA * freqA;
    const freqB = b.get(term) ?? 0;
    dot += freqA * freqB;
  }

  for (const freq of b.values()) {
    normB += freq * freq;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }
  return tf;
}

export function scoreTextMatch(queryTokens: string[], document: string): number {
  const docTokens = tokenize(document);
  const docSet = new Set(docTokens);
  if (!queryTokens.length) return 0;

  let hits = 0;
  for (const token of queryTokens) {
    if (docSet.has(token)) hits += 1;
    else {
      for (const docToken of docTokens) {
        if (docToken.includes(token) || token.includes(docToken)) {
          hits += 0.5;
          break;
        }
      }
    }
  }

  return hits / queryTokens.length;
}

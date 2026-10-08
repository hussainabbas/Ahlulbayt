import { INTENT_PATTERNS } from '../constants/intents';
import type { AiIntent } from '../types';

export function classifyIntent(message: string): AiIntent {
  const scores = new Map<AiIntent, number>();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as Array<
    [AiIntent, RegExp[]]
  >) {
    if (intent === 'blocked') continue;
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(message)) score += 1;
    }
    if (score > 0) scores.set(intent, score);
  }

  if (scores.size === 0) return 'islamic_qa';

  let best: AiIntent = 'islamic_qa';
  let bestScore = 0;
  for (const [intent, score] of scores) {
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}

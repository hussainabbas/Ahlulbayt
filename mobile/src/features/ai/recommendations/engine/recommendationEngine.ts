import { RECOMMENDATION_CATALOG } from '../data/catalog';
import {
  applyPenalties,
  reasonKey,
  resolveReason,
  scoreBehavior,
  scoreDate,
  scoreEvents,
} from './scorers';
import type { RecommendationContext, RecommendationFeed, ScoredRecommendation } from '../types';

const DATE_WEIGHT = 0.35;
const BEHAVIOR_WEIGHT = 0.3;
const EVENT_WEIGHT = 0.35;

export function generateRecommendations(
  ctx: RecommendationContext,
  limit = 8,
  categoryFilter?: ScoredRecommendation['item']['category'],
): RecommendationFeed {
  const scored: ScoredRecommendation[] = [];

  for (const item of RECOMMENDATION_CATALOG) {
    if (categoryFilter && item.category !== categoryFilter) continue;

    const dateScore = scoreDate(item, ctx);
    const behaviorScore = scoreBehavior(item, ctx);
    const eventScore = scoreEvents(item, ctx);

    let total =
      item.baseWeight +
      dateScore * DATE_WEIGHT * 10 +
      behaviorScore * BEHAVIOR_WEIGHT * 10 +
      eventScore * EVENT_WEIGHT * 10;

    total = applyPenalties(item.id, total, ctx);
    if (total <= 0) continue;

    const reason = resolveReason(dateScore, behaviorScore, eventScore);

    scored.push({
      item,
      score: total,
      reason,
      reasonKey: reasonKey(reason),
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const diversified = diversifyByCategory(scored, limit);

  return {
    items: diversified,
    generatedAt: ctx.now.toISOString(),
  };
}

/** Ensure mix of categories in top results */
function diversifyByCategory(
  sorted: ScoredRecommendation[],
  limit: number,
): ScoredRecommendation[] {
  const result: ScoredRecommendation[] = [];
  const used = new Set<string>();
  const categories = new Set<string>();

  for (const rec of sorted) {
    if (result.length >= limit) break;
    if (used.has(rec.item.id)) continue;

    const catCount = [...categories].filter((c) => c === rec.item.category).length;
    if (catCount >= 2 && result.length < limit - 2) continue;

    result.push(rec);
    used.add(rec.item.id);
    categories.add(rec.item.category);
  }

  if (result.length < limit) {
    for (const rec of sorted) {
      if (result.length >= limit) break;
      if (used.has(rec.item.id)) continue;
      result.push(rec);
      used.add(rec.item.id);
    }
  }

  return result;
}

export function getTopByCategory(
  ctx: RecommendationContext,
): Record<string, ScoredRecommendation | undefined> {
  const categories = ['verse', 'dua', 'ziyarat', 'fasting', 'amaal'] as const;
  return Object.fromEntries(
    categories.map((cat) => [
      cat,
      generateRecommendations(ctx, 1, cat).items[0],
    ]),
  );
}

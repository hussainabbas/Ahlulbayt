import type { RecommendableItem, RecommendationContext, RecommendationReason } from '../types';

export function scoreDate(item: RecommendableItem, ctx: RecommendationContext): number {
  let score = 0;

  if (item.hijriMonth != null && item.hijriMonth === ctx.hijriMonth) {
    score += item.hijriDay != null && item.hijriDay === ctx.hijriDay ? 12 : 6;
  }

  if (item.hijriMonthRange) {
    const [start, end] = item.hijriMonthRange;
    if (ctx.hijriMonth >= start && ctx.hijriMonth <= end) score += 5;
  }

  if (item.dayOfWeek != null && item.dayOfWeek === ctx.dayOfWeek) score += 5;

  if (item.hourStart != null && item.hourEnd != null) {
    if (ctx.hour >= item.hourStart && ctx.hour <= item.hourEnd) score += 4;
  }

  if (ctx.muharramSeason && item.tags.includes('muharram')) score += 4;
  if (ctx.hijriMonth === 9 && item.tags.includes('ramadan')) score += 5;

  return score;
}

export function scoreBehavior(item: RecommendableItem, ctx: RecommendationContext): number {
  let score = 0;

  for (const interest of ctx.interests) {
    if (item.interests?.includes(interest)) score += 4;
  }

  for (const topic of ctx.aiTopics) {
    if (topic === 'quran_reflection' && item.category === 'verse') score += 3;
    if (topic === 'daily_guidance' && (item.category === 'amaal' || item.category === 'dua')) score += 3;
    if (topic === 'imam_biographies' && item.tags.includes('husayn')) score += 4;
    if (topic === 'history' && item.category === 'ziyarat') score += 2;
  }

  if (item.category === 'dua' && item.payload.duaId) {
    if (ctx.bookmarkedDuas.includes(item.payload.duaId)) score += 6;
    const relatedBookmarks = ctx.bookmarkedDuas.length;
    if (relatedBookmarks > 0 && item.category === 'dua') score += 2;
  }

  if (item.category === 'ziyarat' && item.payload.ziyaratId) {
    if (ctx.bookmarkedZiyarat.includes(item.payload.ziyaratId)) score += 6;
  }

  if (item.category === 'verse' && ctx.bookmarkedQuranRefs.length > 2) score += 3;
  if (item.category === 'amaal' && item.payload.route === 'TasbihCounter') {
    if (ctx.tasbihCyclesToday === 0) score += 5;
    else if (ctx.tasbihCyclesToday < 3) score += 2;
  }

  if (ctx.bookmarkedSahifa.length > 0 && item.category === 'dua') score += 1;

  return score;
}

export function scoreEvents(item: RecommendableItem, ctx: RecommendationContext): number {
  let score = 0;

  for (const eventId of item.eventIds ?? []) {
    if (ctx.todayEventIds.includes(eventId)) score += 10;
    else if (ctx.upcomingEventIds.includes(eventId)) score += 5;
  }

  for (const tag of item.tags) {
    if (ctx.todayEventIds.some((id) => id.includes(tag))) score += 3;
  }

  return score;
}

export function resolveReason(
  dateScore: number,
  behaviorScore: number,
  eventScore: number,
): RecommendationReason {
  if (eventScore > 0 && dateScore > 0) return 'date_event';
  if (eventScore > 0) return 'event';
  if (behaviorScore > dateScore && behaviorScore > 0) return 'behavior';
  if (behaviorScore > 0 && dateScore > 0) return 'behavior_date';
  return 'date';
}

export function reasonKey(reason: RecommendationReason): string {
  switch (reason) {
    case 'event':
      return 'recommendations.reasons.event';
    case 'date_event':
      return 'recommendations.reasons.dateEvent';
    case 'behavior':
      return 'recommendations.reasons.behavior';
    case 'behavior_date':
      return 'recommendations.reasons.behaviorDate';
    default:
      return 'recommendations.reasons.date';
  }
}

export function applyPenalties(
  itemId: string,
  score: number,
  ctx: RecommendationContext,
): number {
  if (ctx.dismissedIds.includes(itemId)) return 0;
  if (ctx.recentlyShownIds.includes(itemId)) return score * 0.4;
  return score;
}

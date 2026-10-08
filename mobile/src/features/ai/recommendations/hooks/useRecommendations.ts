import { useMemo, useState } from 'react';

import { useLocale } from '@/i18n/useLocale';
import { useSettingsStore } from '@/stores/settingsStore';

import { buildRecommendationContext } from '../context/buildRecommendationContext';
import { generateRecommendations, getTopByCategory } from '../engine/recommendationEngine';
import { useRecommendationStore } from '../stores/recommendationStore';
import type { RecommendationFeed, ScoredRecommendation } from '../types';

export function useRecommendations(limit = 8) {
  const { locale } = useLocale();
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const markShown = useRecommendationStore((s) => s.markShown);
  const dismiss = useRecommendationStore((s) => s.dismiss);
  const [now] = useState(() => new Date());

  const feed: RecommendationFeed = useMemo(() => {
    if (!aiEnabled) return { items: [], generatedAt: now.toISOString() };
    const ctx = buildRecommendationContext(locale, now);
    return generateRecommendations(ctx, limit);
  }, [aiEnabled, locale, now, limit]);

  const topByCategory = useMemo(() => {
    if (!aiEnabled) return {};
    const ctx = buildRecommendationContext(locale, now);
    return getTopByCategory(ctx);
  }, [aiEnabled, locale, now]);

  const trackImpression = (items: ScoredRecommendation[]) => {
    markShown(items.map((i) => i.item.id));
  };

  return {
    feed,
    items: feed.items,
    topByCategory,
    aiEnabled,
    dismiss,
    trackImpression,
  };
}

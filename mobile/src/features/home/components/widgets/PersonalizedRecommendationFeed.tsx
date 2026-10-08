import { RecommendationFeed } from '@/features/ai/recommendations/components/RecommendationFeed';
import type { ScoredRecommendation } from '@/features/ai/recommendations/types';

interface PersonalizedRecommendationFeedProps {
  items: ScoredRecommendation[];
  dismiss: (id: string) => void;
  trackImpression: (items: ScoredRecommendation[]) => void;
}

export function PersonalizedRecommendationFeed({
  items,
  dismiss,
  trackImpression,
}: PersonalizedRecommendationFeedProps) {
  return (
    <RecommendationFeed
      items={items}
      onDismiss={dismiss}
      onImpression={trackImpression}
    />
  );
}

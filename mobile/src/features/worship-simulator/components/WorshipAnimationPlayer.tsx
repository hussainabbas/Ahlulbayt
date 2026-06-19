import type { WorshipPose } from '../types';

export type AnimationRenderMode = 'svg' | 'lottie' | 'auto';

interface WorshipAnimationPlayerProps {
  pose: WorshipPose;
  animationAssetKey?: string;
  variant?: 'full' | 'thumb';
  mode?: AnimationRenderMode;
  subtitle?: string | null;
  showPostureLabel?: boolean;
}

/** Worship figures disabled until pose geometry and assets are finalized. */
export function WorshipAnimationPlayer(_props: WorshipAnimationPlayerProps) {
  return null;
}

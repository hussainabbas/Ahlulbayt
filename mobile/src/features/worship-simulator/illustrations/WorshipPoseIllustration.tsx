import type { IllustrationTheme } from './tokens';
import type { WorshipPose } from '../types';

interface WorshipPoseIllustrationProps {
  pose: WorshipPose;
  theme: IllustrationTheme;
  /** Thumbnail — simplified, smaller effective scale */
  variant?: 'full' | 'thumb';
  animated?: boolean;
}

/** Custom Jafari worship figure — SVG + Reanimated (disabled until pose geometry is complete). */
export function WorshipPoseIllustration(_props: WorshipPoseIllustrationProps) {
  return null;
}

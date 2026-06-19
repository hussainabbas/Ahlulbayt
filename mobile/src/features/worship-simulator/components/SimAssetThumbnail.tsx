import type { SimAssetKey } from '../illustrations/catalog';
import type { WorshipPose } from '../types';

interface SimAssetThumbnailProps {
  pose: WorshipPose;
  animationAssetKey?: SimAssetKey;
  size?: number;
}

/** Compact thumbnail — figures disabled for now. */
export function SimAssetThumbnail(_props: SimAssetThumbnailProps) {
  return null;
}

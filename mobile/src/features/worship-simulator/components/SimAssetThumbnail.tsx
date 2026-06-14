import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

import type { SimAssetKey } from '../illustrations/catalog';
import type { WorshipPose } from '../types';
import { WorshipAnimationPlayer } from './WorshipAnimationPlayer';

interface SimAssetThumbnailProps {
  pose: WorshipPose;
  animationAssetKey?: SimAssetKey;
  size?: number;
}

/** Compact thumbnail for hub lists and step pickers. */
export function SimAssetThumbnail({
  pose,
  animationAssetKey,
  size = 80,
}: SimAssetThumbnailProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: Math.round(size * 1.1),
          backgroundColor: theme.colors.surfaceMuted,
        },
      ]}
    >
      <WorshipAnimationPlayer
        pose={pose}
        animationAssetKey={animationAssetKey}
        variant="thumb"
        mode="svg"
        showPostureLabel={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 10,
    overflow: 'hidden',
  },
});

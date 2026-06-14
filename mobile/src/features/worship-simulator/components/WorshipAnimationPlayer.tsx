import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { resolveAssetKey, type SimAssetKey } from '../illustrations/catalog';
import { WorshipPoseIllustration } from '../illustrations/WorshipPoseIllustration';
import type { IllustrationTheme } from '../illustrations/tokens';
import type { WorshipPose } from '../types';
import { WorshipLottieLayer } from './WorshipLottieLayer';

export type AnimationRenderMode = 'svg' | 'lottie' | 'auto';

interface WorshipAnimationPlayerProps {
  pose: WorshipPose;
  animationAssetKey?: string;
  variant?: 'full' | 'thumb';
  mode?: AnimationRenderMode;
  subtitle?: string | null;
  showPostureLabel?: boolean;
}

const POSE_LABELS: Record<WorshipPose, string> = {
  standing_neutral: 'Standing',
  takbir: 'Takbir',
  standing_qiyam: 'Qiyam',
  qunoot_hands_raised: 'Qunoot',
  ruku: 'Ruku',
  sujud: 'Sujood',
  jalsa: 'Jalsa',
  tashahhud_sitting: 'Tashahhud',
  completion_dhikr: 'Completion',
  wash_hands: 'Wash hands',
  wash_face: 'Wash face',
  wash_arm_right: 'Right arm',
  wash_arm_left: 'Left arm',
  masah_head: 'Masah head',
  masah_feet: 'Masah feet',
  ghusl_niyyah: 'Ghusl niyyah',
  ghusl_head: 'Ghusl head',
  ghusl_right: 'Right side',
  ghusl_left: 'Left side',
  ghusl_immersion: 'Immersion',
};

/** Custom AhlulBayt+ worship animation player — SVG + Lottie (no internet GIFs). */
export function WorshipAnimationPlayer({
  pose,
  animationAssetKey,
  variant = 'full',
  mode = 'auto',
  subtitle,
  showPostureLabel = true,
}: WorshipAnimationPlayerProps) {
  const { theme } = useTheme();
  const illustrationTheme: IllustrationTheme = theme.isDark ? 'dark' : 'light';
  const assetKey = resolveAssetKey(pose, animationAssetKey) as SimAssetKey | undefined;
  const isThumb = variant === 'thumb';

  return (
    <View
      style={[
        isThumb ? styles.thumbStage : styles.stage,
        { backgroundColor: theme.colors.surfaceMuted },
      ]}
    >
      <View style={styles.canvas}>
        <WorshipPoseIllustration
          pose={pose}
          theme={illustrationTheme}
          variant={variant}
          animated
        />
        {mode !== 'svg' && assetKey ? (
          <WorshipLottieLayer assetKey={assetKey} theme={illustrationTheme} />
        ) : null}
      </View>

      {showPostureLabel && !isThumb ? (
        <Text variant="caption" color="accent" weight="600">
          {POSE_LABELS[pose]}
        </Text>
      ) : null}

      {subtitle && !isThumb ? (
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    minHeight: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  thumbStage: {
    width: 80,
    height: 88,
    borderRadius: 10,
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

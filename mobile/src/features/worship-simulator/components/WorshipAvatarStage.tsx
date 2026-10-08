import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { transitionDurationMs } from '../constants/poses';
import type { WorshipPose } from '../types';
import { WorshipAnimationPlayer } from './WorshipAnimationPlayer';

interface WorshipAvatarStageProps {
  pose: WorshipPose;
  isTransitioning?: boolean;
  animationAssetKey?: string;
  subtitle?: string | null;
  showPostureLabel?: boolean;
}

/** Jafari worship illustration stage — custom SVG/Lottie library (no internet GIFs). */
export function WorshipAvatarStage({
  pose,
  isTransitioning,
  animationAssetKey,
  subtitle,
  showPostureLabel = true,
}: WorshipAvatarStageProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const [displayPose, setDisplayPose] = useState(pose);

  useEffect(() => {
    const duration = transitionDurationMs(pose);
    scale.value = withTiming(isTransitioning ? 0.97 : 1, { duration: duration / 2 });
    translateY.value = withTiming(pose === 'sujud' ? 10 : pose === 'ruku' ? 6 : 0, {
      duration,
    });
    const timer = setTimeout(() => setDisplayPose(pose), duration);
    return () => clearTimeout(timer);
  }, [pose, isTransitioning, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <WorshipAnimationPlayer
        pose={displayPose}
        animationAssetKey={animationAssetKey}
        subtitle={subtitle}
        showPostureLabel={showPostureLabel}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
});

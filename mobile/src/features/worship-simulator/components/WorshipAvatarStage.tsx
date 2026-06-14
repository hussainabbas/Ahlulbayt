import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { transitionDurationMs } from '../constants/poses';
import type { WorshipPose } from '../types';
import { QunootPoseView } from './QunootPoseView';

interface WorshipAvatarStageProps {
  pose: WorshipPose;
  isTransitioning?: boolean;
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

/** Reanimated avatar silhouette — Lottie/Rive replaces body in phase 2. */
export function WorshipAvatarStage({
  pose,
  isTransitioning,
  subtitle,
  showPostureLabel = true,
}: WorshipAvatarStageProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const [displayPose, setDisplayPose] = useState(pose);

  useEffect(() => {
    const duration = transitionDurationMs(pose);
    scale.value = withTiming(isTransitioning ? 0.96 : 1, { duration: duration / 2 });
    translateY.value = withTiming(pose === 'sujud' ? 28 : pose === 'ruku' ? 14 : 0, {
      duration,
    });
    const timer = setTimeout(() => setDisplayPose(pose), duration);
    return () => clearTimeout(timer);
  }, [pose, isTransitioning, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  if (displayPose === 'qunoot_hands_raised') {
    return <QunootPoseView subtitle={subtitle} />;
  }

  return (
    <View style={[styles.stage, { backgroundColor: theme.colors.surfaceMuted }]}>
      <Animated.View style={[styles.avatar, animatedStyle]}>
        <View style={[styles.head, { backgroundColor: theme.colors.accentPrimaryMuted }]} />
        <View style={[styles.torso, { backgroundColor: theme.colors.accentPrimary }]} />
        <View style={styles.limbRow}>
          <View style={[styles.limb, { backgroundColor: theme.colors.accentPrimaryMuted }]} />
          <View style={[styles.limb, { backgroundColor: theme.colors.accentPrimaryMuted }]} />
        </View>
      </Animated.View>

      {showPostureLabel ? (
        <Text variant="caption" color="accent" weight="600">
          {POSE_LABELS[displayPose]}
        </Text>
      ) : null}

      {subtitle ? (
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  avatar: { alignItems: 'center', gap: 4 },
  head: { width: 36, height: 36, borderRadius: 18 },
  torso: { width: 48, height: 64, borderRadius: 10 },
  limbRow: { flexDirection: 'row', gap: 40 },
  limb: { width: 14, height: 48, borderRadius: 7 },
  subtitle: { textAlign: 'center', paddingHorizontal: 16 },
});

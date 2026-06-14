import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { QUNOOT_DEFAULT_PAUSE_MS } from '../constants/poses';

interface QunootPoseViewProps {
  subtitle?: string | null;
  pauseMs?: number;
}

/** Shia qunoot: raised hands, calm hold, synced dua text. */
export function QunootPoseView({ subtitle, pauseMs = QUNOOT_DEFAULT_PAUSE_MS }: QunootPoseViewProps) {
  const { theme } = useTheme();
  const handRaise = useSharedValue(0);
  const glow = useSharedValue(0.4);

  useEffect(() => {
    handRaise.value = withTiming(1, { duration: 700 });
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1200 }), withTiming(0.4, { duration: 1200 })),
      -1,
      true,
    );
  }, [glow, handRaise]);

  const handsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -24 * handRaise.value }],
    opacity: 0.5 + handRaise.value * 0.5,
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.35,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
      <Animated.View
        style={[styles.aura, auraStyle, { backgroundColor: theme.colors.accentPrimary }]}
      />
      <Animated.View style={[styles.handsRow, handsStyle]}>
        <View style={[styles.hand, { backgroundColor: theme.colors.accentPrimary }]} />
        <View style={[styles.head, { backgroundColor: theme.colors.surfaceElevated }]} />
        <View style={[styles.hand, { backgroundColor: theme.colors.accentPrimary }]} />
      </Animated.View>
      <Text variant="overline" color="accent" weight="600">
        Qunoot — hands raised
      </Text>
      <Text variant="bodySm" style={[styles.arabic, { color: theme.colors.textPrimary }]}>
        رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً…
      </Text>
      {subtitle ? (
        <Text variant="caption" color="secondary">
          {subtitle}
        </Text>
      ) : null}
      <Text variant="caption" color="tertiary">
        {Math.round(pauseMs / 1000)}s pause
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  aura: {
    ...StyleSheet.absoluteFillObject,
  },
  handsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 20,
    marginBottom: 8,
  },
  hand: { width: 18, height: 36, borderRadius: 9 },
  head: { width: 32, height: 32, borderRadius: 16 },
  arabic: { textAlign: 'center', writingDirection: 'rtl', paddingHorizontal: 12 },
});

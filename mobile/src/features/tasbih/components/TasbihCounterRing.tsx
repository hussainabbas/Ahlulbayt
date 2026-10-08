import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

interface TasbihCounterRingProps {
  count: number;
  target: number;
  label: string;
  arabic: string;
  onTap: () => void;
}

function progressBorderColors(
  progress: number,
  accent: string,
  track: string,
): {
  borderTopColor: string;
  borderRightColor: string;
  borderBottomColor: string;
  borderLeftColor: string;
} {
  return {
    borderTopColor: progress > 0 ? accent : track,
    borderRightColor: progress > 0.25 ? accent : track,
    borderBottomColor: progress > 0.5 ? accent : track,
    borderLeftColor: progress > 0.75 ? accent : track,
  };
}

export function TasbihCounterRing({
  count,
  target,
  label,
  arabic,
  onTap,
}: TasbihCounterRingProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progress = Math.min(1, count / target);
  const progressColors = progressBorderColors(
    progress,
    theme.colors.accentPrimary,
    theme.colors.accentPrimaryMuted,
  );

  const handleTap = () => {
    scale.value = withSequence(
      withSpring(0.96, { damping: 12 }),
      withSpring(1, { damping: 10 }),
    );
    onTap();
  };

  return (
    <Pressable onPress={handleTap} style={styles.wrapper} accessibilityRole="button">
      <Animated.View style={[styles.shell, ringStyle]}>
        <View
          style={[
            styles.progressRing,
            progressColors,
            {
              borderColor: theme.colors.accentPrimaryMuted,
            },
          ]}
        />
        <View
          style={[
            styles.ring,
            getShadow('md', theme.scheme),
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text style={[styles.arabic, { color: theme.colors.textPrimary }]}>{arabic}</Text>

          <View style={styles.countRow}>
            <Text variant="displayLg" color="accent">
              {count}
            </Text>
            <Text variant="bodySm" color="tertiary" style={styles.target}>
              / {target}
            </Text>
          </View>

          <Text variant="bodyMd" color="secondary" style={styles.label}>
            {label}
          </Text>

          <View style={[styles.tapPill, { backgroundColor: theme.colors.surfaceMuted }]}>
            <Text variant="caption" color="tertiary">
              {t('tasbih.counter.tapHint')}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const RING_SIZE = 272;
const PROGRESS_RING_SIZE = RING_SIZE + 8;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shell: {
    width: PROGRESS_RING_SIZE,
    height: PROGRESS_RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: PROGRESS_RING_SIZE,
    height: PROGRESS_RING_SIZE,
    borderRadius: PROGRESS_RING_SIZE / 2,
    borderWidth: 5,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 6,
  },
  arabic: {
    fontSize: 30,
    lineHeight: 42,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  target: {
    marginBottom: 6,
  },
  label: {
    textAlign: 'center',
    marginTop: 2,
  },
  tapPill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
});

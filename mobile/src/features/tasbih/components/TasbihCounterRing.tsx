import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface TasbihCounterRingProps {
  count: number;
  target: number;
  label: string;
  arabic: string;
  onTap: () => void;
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

  const handleTap = () => {
    scale.value = withSequence(
      withSpring(0.94, { damping: 12 }),
      withSpring(1, { damping: 10 }),
    );
    onTap();
  };

  return (
    <Pressable onPress={handleTap} style={styles.wrapper}>
      <Animated.View
        style={[
          styles.ring,
          ringStyle,
          {
            borderColor: theme.colors.accentPrimary,
            backgroundColor: theme.colors.surfaceElevated,
          },
        ]}
      >
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: theme.colors.accentPrimary,
              },
            ]}
          />
        </View>

        <Text
          style={[styles.arabic, { color: theme.colors.textPrimary }]}
        >
          {arabic}
        </Text>
        <Text variant="displayMd" color="accent">
          {count}
        </Text>
        <Text variant="caption" color="tertiary">
          / {target}
        </Text>
        <Text variant="bodySm" color="secondary" style={styles.label}>
          {label}
        </Text>
        <Text variant="caption" color="tertiary" style={styles.hint}>
          {t('tasbih.counter.tapHint')}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  ring: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },
  progressTrack: {
    position: 'absolute',
    top: 16,
    left: 24,
    right: 24,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  arabic: {
    fontSize: 28,
    lineHeight: 44,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  label: {
    textAlign: 'center',
    marginTop: 4,
  },
  hint: {
    marginTop: 8,
  },
});

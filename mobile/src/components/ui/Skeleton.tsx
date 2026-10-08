import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing } from '@/theme/motion';
import { useTheme } from '@/theme/ThemeContext';

type SkeletonDimension = number | `${number}%`;

interface SkeletonProps {
  width?: SkeletonDimension;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);
  const radius = borderRadius ?? theme.radius.sm;

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: duration.ambient, easing: easing.linear }),
      -1,
      false,
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-160, 320]),
      },
    ],
  }));

  const highlight = theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.65)';

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: theme.colors.surfaceMuted,
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', highlight, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmerBand}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  shimmerBand: {
    width: 120,
    height: '100%',
  },
});

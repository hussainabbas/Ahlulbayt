import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { duration } from '@/theme/motion';
import { useTheme } from '@/theme/ThemeContext';

export function StreamingCursor() {
  const { theme } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: duration.normal }),
        withTiming(1, { duration: duration.normal }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.cursor, { backgroundColor: theme.colors.accentPrimary }, style]}
    />
  );
}

const styles = StyleSheet.create({
  cursor: {
    width: 2,
    height: 16,
    borderRadius: 1,
    marginLeft: 2,
  },
});

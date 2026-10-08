import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { duration } from '@/theme/motion';
import { useTheme } from '@/theme/ThemeContext';

function Dot({ delay }: { delay: number }) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration.normal }),
          withTiming(0.35, { duration: duration.normal }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: theme.colors.textTertiary },
        style,
      ]}
    />
  );
}

export function TypingIndicator() {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
      accessibilityLabel={t('ai.thinking')}
    >
      <View style={styles.dots}>
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </View>
      <Text variant="caption" color="tertiary">
        {t('ai.thinking')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { TabGlyph, type TabIconName } from './TabIcons';

interface TabBarItemProps {
  label: string;
  icon: TabIconName;
  focused: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityHint?: string;
}

const springConfig = {
  damping: 18,
  stiffness: 260,
  mass: 0.7,
};

export const TabBarItem = memo(function TabBarItem({
  label,
  icon,
  focused,
  onPress,
  onLongPress,
  accessibilityHint,
}: TabBarItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(focused ? 1 : 0.94);
  const dotScale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.94, springConfig);
    dotScale.value = withSpring(focused ? 1 : 0, springConfig);
  }, [focused, scale, dotScale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  const activeColor = theme.colors.accentPrimary;
  const inactiveColor = theme.colors.textTertiary;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      <Animated.View style={[styles.iconWrap, animatedIconStyle]}>
        <TabGlyph
          name={icon}
          color={focused ? activeColor : inactiveColor}
          focused={focused}
          size={24}
        />
        <Animated.View
          style={[
            styles.activeDot,
            { backgroundColor: activeColor },
            animatedDotStyle,
          ]}
        />
      </Animated.View>
      <Text
        variant="caption"
        color={focused ? 'accent' : 'tertiary'}
        weight={focused ? '600' : '500'}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 2,
    minHeight: 52,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    marginBottom: 4,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.15,
    textAlign: 'center',
  },
});

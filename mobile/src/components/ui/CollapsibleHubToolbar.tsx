import type { ReactNode } from 'react';
import { Animated, StyleSheet, View, type Animated as AnimatedType } from 'react-native';

import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export const COLLAPSIBLE_TOOLBAR_MAX = 108;
export const COLLAPSIBLE_TOOLBAR_MIN = 58;

interface CollapsibleHubToolbarProps {
  scrollY: AnimatedType.Value;
  search: ReactNode;
  filters: ReactNode;
}

export function CollapsibleHubToolbar({ scrollY, search, filters }: CollapsibleHubToolbarProps) {
  const { theme } = useTheme();

  const toolbarHeight = scrollY.interpolate({
    inputRange: [0, 72],
    outputRange: [COLLAPSIBLE_TOOLBAR_MAX, COLLAPSIBLE_TOOLBAR_MIN],
    extrapolate: 'clamp',
  });

  const filtersHeight = scrollY.interpolate({
    inputRange: [0, 48],
    outputRange: [44, 0],
    extrapolate: 'clamp',
  });

  const filtersOpacity = scrollY.interpolate({
    inputRange: [0, 32],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.toolbar,
        {
          height: toolbarHeight,
          backgroundColor: theme.colors.backgroundPrimary,
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.inner}>{search}</View>
      <Animated.View
        style={[
          styles.filtersWrap,
          {
            height: filtersHeight,
            opacity: filtersOpacity,
          },
        ]}
      >
        {filters}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  inner: {
    marginBottom: layout.listGap,
  },
  filtersWrap: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

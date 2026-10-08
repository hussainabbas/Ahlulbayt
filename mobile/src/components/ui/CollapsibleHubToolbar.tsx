import type { ReactNode } from 'react';
import { Animated, StyleSheet, View, type Animated as AnimatedType } from 'react-native';

import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

export const COLLAPSIBLE_TOOLBAR_MAX = 108;
export const COLLAPSIBLE_TOOLBAR_MIN = 58;
/** Toolbar height when no filter row is shown (search only). */
export const COLLAPSIBLE_TOOLBAR_SEARCH_ONLY = 64;

interface CollapsibleHubToolbarProps {
  scrollY: AnimatedType.Value;
  search: ReactNode;
  filters?: ReactNode;
  /** When true, omits the filter row so there is no dead space under search. */
  searchOnly?: boolean;
}

export function CollapsibleHubToolbar({
  scrollY,
  search,
  filters,
  searchOnly = false,
}: CollapsibleHubToolbarProps) {
  const { theme } = useTheme();

  const maxHeight = searchOnly ? COLLAPSIBLE_TOOLBAR_SEARCH_ONLY : COLLAPSIBLE_TOOLBAR_MAX;
  const minHeight = searchOnly ? COLLAPSIBLE_TOOLBAR_SEARCH_ONLY : COLLAPSIBLE_TOOLBAR_MIN;

  const toolbarHeight = scrollY.interpolate({
    inputRange: [0, 72],
    outputRange: [maxHeight, minHeight],
    extrapolate: 'clamp',
  });

  const filtersHeight = searchOnly
    ? 0
    : scrollY.interpolate({
        inputRange: [0, 48],
        outputRange: [44, 0],
        extrapolate: 'clamp',
      });

  const filtersOpacity = searchOnly
    ? 0
    : scrollY.interpolate({
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
      <View style={[styles.inner, searchOnly && styles.innerCompact]}>{search}</View>
      {!searchOnly && filters ? (
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
      ) : null}
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
  innerCompact: {
    marginBottom: 0,
  },
  filtersWrap: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

import { RefreshControl, ScrollView, View, type ViewProps, StyleSheet } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { useEffectiveSafeInsets } from '@/core/native/safeArea';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface ScreenProps extends ViewProps {
  scroll?: boolean;
  padded?: boolean;
  /** When false, omit bottom safe-area inset (e.g. tab screens with their own tab bar). */
  safeBottom?: boolean;
  /** When false, omit top safe-area inset (e.g. stack screens with a native header). */
  safeTop?: boolean;
  /** Override which edges receive safe-area padding. */
  edges?: Edge[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

function resolveInsetFlags(
  safeTop: boolean,
  safeBottom: boolean,
  edges?: Edge[],
): { top: boolean; bottom: boolean } {
  if (edges) {
    return {
      top: edges.includes('top'),
      bottom: edges.includes('bottom'),
    };
  }

  return { top: safeTop, bottom: safeBottom };
}

export function Screen({
  scroll = false,
  padded = true,
  safeBottom = true,
  safeTop = true,
  edges,
  refreshing = false,
  onRefresh,
  style,
  children,
  ...rest
}: ScreenProps) {
  const { theme } = useTheme();
  const insets = useEffectiveSafeInsets();
  const insetFlags = resolveInsetFlags(safeTop, safeBottom, edges);

  const contentStyle = [
    styles.content,
    {
      backgroundColor: theme.colors.backgroundPrimary,
      paddingHorizontal: padded ? layout.screenPaddingX : 0,
      paddingTop:
        (insetFlags.top ? insets.top : 0) + (padded ? layout.screenPaddingY : 0),
      paddingBottom:
        (insetFlags.bottom ? insets.bottom : 0) + (padded ? layout.sectionGap : 0),
    },
    style,
  ];

  const refreshControl =
    scroll && onRefresh ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.colors.accentPrimary}
        colors={[theme.colors.accentPrimary]}
        progressBackgroundColor={theme.colors.surfaceElevated}
      />
    ) : undefined;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.root, { backgroundColor: theme.colors.backgroundPrimary }]}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        contentInsetAdjustmentBehavior="never"
        {...rest}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.colors.backgroundPrimary },
        contentStyle,
        styles.fill,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
  },
});

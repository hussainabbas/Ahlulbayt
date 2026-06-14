import { RefreshControl, ScrollView, View, type ViewProps, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { layout } from '@/theme/layout';

import { useTheme } from '@/theme/ThemeContext';



interface ScreenProps extends ViewProps {

  scroll?: boolean;

  padded?: boolean;

  /** When false, omit bottom safe-area inset (e.g. tab screens with their own tab bar). */
  safeBottom?: boolean;

  /** When false, omit top safe-area inset (e.g. stack screens with a native header). */
  safeTop?: boolean;

  refreshing?: boolean;

  onRefresh?: () => void;

}



export function Screen({

  scroll = false,

  padded = true,

  safeBottom = true,

  safeTop = true,

  refreshing = false,

  onRefresh,

  style,

  children,

  ...rest

}: ScreenProps) {

  const { theme } = useTheme();

  const insets = useSafeAreaInsets();



  const contentStyle = [

    styles.content,

    {

      backgroundColor: theme.colors.backgroundPrimary,

      paddingHorizontal: padded ? layout.screenPaddingX : 0,

      paddingTop: (safeTop ? insets.top : 0) + (padded ? layout.screenPaddingY : 0),

      paddingBottom: safeBottom ? insets.bottom + layout.sectionGap : 0,

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



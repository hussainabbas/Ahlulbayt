import { RefreshControl, ScrollView, View, type ViewProps, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { layout } from '@/theme/layout';

import { useTheme } from '@/theme/ThemeContext';



interface ScreenProps extends ViewProps {

  scroll?: boolean;

  padded?: boolean;

  /** When false, omit bottom safe-area inset (e.g. tab screens with their own tab bar). */
  safeBottom?: boolean;

  refreshing?: boolean;

  onRefresh?: () => void;

}



export function Screen({

  scroll = false,

  padded = true,

  safeBottom = true,

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

      paddingTop: insets.top + layout.screenPaddingY,

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

});



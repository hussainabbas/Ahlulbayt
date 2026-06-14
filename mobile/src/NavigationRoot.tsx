import { NavigationContainer, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useMemo } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';

import { RootNavigator } from '@/navigation';
import { navigationRef } from '@/navigation/navigationRef';
import { NotificationEventHandler } from '@/features/notifications/components/NotificationEventHandler';
import { useTheme } from '@/theme/ThemeContext';

export function NavigationRoot() {
  const { theme } = useTheme();

  const navigationTheme = useMemo(
    () => ({
      dark: theme.isDark,
      colors: {
        primary: theme.colors.accentPrimary,
        background: theme.colors.backgroundPrimary,
        card: theme.colors.surfaceElevated,
        text: theme.colors.textPrimary,
        border: theme.colors.borderSubtle,
        notification: theme.colors.accentPrimary,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' as const },
        medium: { fontFamily: 'System', fontWeight: '500' as const },
        bold: { fontFamily: 'System', fontWeight: '700' as const },
        heavy: { fontFamily: 'System', fontWeight: '800' as const },
      },
    }),
    [
      theme.isDark,
      theme.colors.accentPrimary,
      theme.colors.backgroundPrimary,
      theme.colors.surfaceElevated,
      theme.colors.textPrimary,
      theme.colors.borderSubtle,
    ],
  );

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <View style={styles.root}>
          <RootNavigator />
          <NotificationEventHandler />
        </View>
      </NavigationContainer>
    </NavigationThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

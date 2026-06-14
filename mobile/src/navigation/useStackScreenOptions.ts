import { useMemo } from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { useTheme } from '@/theme/ThemeContext';

export function useStackScreenOptions() {
  const { theme } = useTheme();

  return useMemo(() => {
    const base: NativeStackNavigationOptions = {
      headerShown: true,
      headerBackTitle: '',
      headerTintColor: theme.colors.accentPrimary,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerShadowVisible: false,
      contentStyle: { flex: 1, backgroundColor: theme.colors.backgroundPrimary },
    };

    return {
      root: {
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: theme.colors.backgroundPrimary },
      } satisfies NativeStackNavigationOptions,
      base,
      titled: (title = ''): NativeStackNavigationOptions => ({ ...base, title }),
      modal: (title = ''): NativeStackNavigationOptions => ({
        ...base,
        title,
        presentation: 'modal',
      }),
    };
  }, [theme.colors.accentPrimary, theme.colors.backgroundPrimary]);
}

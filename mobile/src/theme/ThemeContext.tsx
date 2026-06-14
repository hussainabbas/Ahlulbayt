import { useColorScheme as useSystemColorScheme } from 'react-native';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ThemeMode } from '@/core/config/constants';
import { parseHijriDate } from '@/features/calendar/engine/hijriUtils';
import { resolveMuharramThemeActive } from '@/features/muharram/hooks/useMuharramMode';
import { useMuharramStore } from '@/features/muharram/stores/muharramStore';
import { useSettingsStore } from '@/stores/settingsStore';

import { getColors, type ColorScheme, type ThemeColors, type ThemeVariant } from './colors';
import { fontFamily, radius, spacing, typography } from './tokens';
import { layout } from './layout';

export interface Theme {
  scheme: ColorScheme;
  variant: ThemeVariant;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  layout: typeof layout;
  isDark: boolean;
  isMuharram: boolean;
}

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(mode: ThemeMode, systemScheme: ColorScheme | null | undefined): ColorScheme {
  if (mode === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const locale = useSettingsStore((s) => s.locale);
  const muharramMode = useMuharramStore((s) => s.mode);
  const muharramBlackTheme = useMuharramStore((s) => s.blackTheme);
  const [now] = useState(() => new Date());

  const scheme = resolveScheme(themeMode, systemScheme as ColorScheme | null | undefined);
  const hijri = useMemo(() => parseHijriDate(now, locale), [now, locale]);
  const isMuharram = resolveMuharramThemeActive(
    muharramMode,
    muharramBlackTheme,
    hijri.month,
    hijri.day,
  );
  const variant: ThemeVariant = isMuharram ? 'muharram' : 'default';

  const theme = useMemo<Theme>(
    () => ({
      scheme,
      variant,
      colors: getColors(scheme, variant),
      spacing,
      radius,
      typography,
      fontFamily,
      layout,
      isDark: scheme === 'dark' || variant === 'muharram',
      isMuharram,
    }),
    [scheme, variant, isMuharram],
  );

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
    }),
    [theme, themeMode, setThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemeColors(): ThemeColors {
  return useTheme().theme.colors;
}

export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}

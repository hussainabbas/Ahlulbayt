export type ColorScheme = 'light' | 'dark';
export type ThemeVariant = 'default' | 'muharram';

export interface ThemeColors {
  backgroundPrimary: string;
  backgroundSecondary: string;
  surfaceElevated: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  accentPrimary: string;
  accentPrimaryMuted: string;
  accentGold: string;
  borderSubtle: string;
  borderStrong: string;
  success: string;
  warning: string;
  error: string;
  tabBar: string;
  tabBarBorder: string;
  prayer: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export const lightColors: ThemeColors = {
  backgroundPrimary: '#F8F6F1',
  backgroundSecondary: '#F0EDE6',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#E8E4DC',
  textPrimary: '#1A1A18',
  textSecondary: '#5C5A54',
  textTertiary: '#8A877F',
  textInverse: '#F8F6F1',
  accentPrimary: '#1F5C52',
  accentPrimaryMuted: 'rgba(31, 92, 82, 0.08)',
  accentGold: '#B8956B',
  borderSubtle: 'rgba(26, 26, 24, 0.06)',
  borderStrong: 'rgba(26, 26, 24, 0.12)',
  success: '#2D6A4F',
  warning: '#9A6B2E',
  error: '#8B3A3A',
  tabBar: 'rgba(248, 246, 241, 0.95)',
  tabBarBorder: 'rgba(26, 26, 24, 0.08)',
  prayer: {
    fajr: '#4A6FA5',
    dhuhr: '#C4A962',
    asr: '#B87D4B',
    maghrib: '#7B4B6A',
    isha: '#3D4A6B',
  },
};

export const darkColors: ThemeColors = {
  backgroundPrimary: '#0C0D0F',
  backgroundSecondary: '#12141A',
  surfaceElevated: '#181A22',
  surfaceMuted: '#1E2129',
  textPrimary: '#F2F0EB',
  textSecondary: '#9B9890',
  textTertiary: '#6B6860',
  textInverse: '#0C0D0F',
  accentPrimary: '#3D9B8A',
  accentPrimaryMuted: 'rgba(61, 155, 138, 0.09)',
  accentGold: '#D4B87A',
  borderSubtle: 'rgba(255, 255, 255, 0.04)',
  borderStrong: 'rgba(255, 255, 255, 0.08)',
  success: '#3D9B8A',
  warning: '#C4A962',
  error: '#A85555',
  tabBar: 'rgba(12, 13, 15, 0.95)',
  tabBarBorder: 'rgba(255, 255, 255, 0.06)',
  prayer: {
    fajr: '#4A6FA5',
    dhuhr: '#C4A962',
    asr: '#B87D4B',
    maghrib: '#7B4B6A',
    isha: '#3D4A6B',
  },
};

/** Deep mourning palette for Muharram mode */
export const muharramColors: ThemeColors = {
  backgroundPrimary: '#050506',
  backgroundSecondary: '#0A0A0C',
  surfaceElevated: '#101012',
  surfaceMuted: '#161618',
  textPrimary: '#E8E4E4',
  textSecondary: '#A89898',
  textTertiary: '#706868',
  textInverse: '#050506',
  accentPrimary: '#8B4545',
  accentPrimaryMuted: 'rgba(139, 69, 69, 0.12)',
  accentGold: '#9A7A5A',
  borderSubtle: 'rgba(180, 100, 100, 0.08)',
  borderStrong: 'rgba(180, 100, 100, 0.16)',
  success: '#5A7A6A',
  warning: '#9A7A5A',
  error: '#A85555',
  tabBar: 'rgba(5, 5, 6, 0.98)',
  tabBarBorder: 'rgba(180, 100, 100, 0.1)',
  prayer: {
    fajr: '#3A4A6A',
    dhuhr: '#9A7A5A',
    asr: '#8A6A4A',
    maghrib: '#6A3A4A',
    isha: '#2A304A',
  },
};

export function getColors(scheme: ColorScheme, variant: ThemeVariant = 'default'): ThemeColors {
  if (variant === 'muharram') return muharramColors;
  return scheme === 'dark' ? darkColors : lightColors;
}

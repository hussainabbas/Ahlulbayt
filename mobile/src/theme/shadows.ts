import type { ColorScheme } from './colors';

export type ShadowLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'glowAccent';

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const shadowDefinitions: Record<Exclude<ShadowLevel, 'none'>, Omit<ShadowStyle, 'elevation'> & { elevation: number }> = {
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 48,
    elevation: 12,
  },
  glowAccent: {
    shadowColor: '#3D9B8A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 0,
  },
};

/**
 * Returns platform shadow styles. In dark mode, caps elevation at `sm` for cards
 * per design system — prefer borders over shadows on content surfaces.
 */
export function getShadow(level: ShadowLevel, scheme: ColorScheme = 'dark'): ShadowStyle | undefined {
  if (level === 'none') {
    return undefined;
  }

  if (scheme === 'dark' && (level === 'md' || level === 'lg')) {
    return shadowDefinitions.sm;
  }

  return shadowDefinitions[level];
}

export const shadows = shadowDefinitions;

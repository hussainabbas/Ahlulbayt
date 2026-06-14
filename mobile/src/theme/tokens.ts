export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const typography = {
  displayLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: -0.6,
  },
  displayMd: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  headingLg: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  headingMd: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  headingSm: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

export const fontFamily = {
  sans: 'System',
  arabic: 'System',
  urdu: 'System',
} as const;

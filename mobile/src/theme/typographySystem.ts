import { PixelRatio, type TextStyle } from 'react-native';

export const FONT_FAMILIES = {
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  scheherazadeRegular: 'ScheherazadeNew-Regular',
  scheherazadeBold: 'ScheherazadeNew-Bold',
  amiriRegular: 'Amiri-Regular',
  amiriBold: 'Amiri-Bold',
  notoNaskhArabic: 'NotoNaskhArabic-Regular',
  notoNastaliqUrdu: 'NotoNastaliqUrdu-Regular',
} as const;

export type UiTextRole =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'button'
  | 'label'
  | 'overline';

export type SacredTextRole =
  | 'quranArabic'
  | 'duaArabic'
  | 'hadithArabic'
  | 'transliteration'
  | 'translation'
  | 'reference';

export type ArabicLineHeightRole = 'quran' | 'dua' | 'arabic' | 'urdu';

const ARABIC_LINE_HEIGHT_RATIO: Record<ArabicLineHeightRole, number> = {
  quran: 2.15,
  dua: 1.95,
  arabic: 1.85,
  urdu: 1.9,
};

const UI_SCALE: Record<
  UiTextRole,
  Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'> & {
    fontFamily: (typeof FONT_FAMILIES)[keyof typeof FONT_FAMILIES];
  }
> = {
  display: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '600',
    letterSpacing: -0.6,
  },
  heading: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  title: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontFamily: FONT_FAMILIES.interMedium,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0,
  },
  body: {
    fontFamily: FONT_FAMILIES.interRegular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption: {
    fontFamily: FONT_FAMILIES.interMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  button: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  label: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: FONT_FAMILIES.interSemiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
};

const SACRED_SCALE: Record<
  SacredTextRole,
  Pick<TextStyle, 'fontSize' | 'fontWeight' | 'letterSpacing' | 'fontStyle'> & {
    fontFamily: string;
    lineHeightRole?: ArabicLineHeightRole;
    fixedLineHeight?: number;
  }
> = {
  quranArabic: {
    fontFamily: FONT_FAMILIES.scheherazadeRegular,
    fontSize: 26,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeightRole: 'quran',
  },
  duaArabic: {
    fontFamily: FONT_FAMILIES.amiriRegular,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeightRole: 'dua',
  },
  hadithArabic: {
    fontFamily: FONT_FAMILIES.amiriRegular,
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeightRole: 'arabic',
  },
  transliteration: {
    fontFamily: FONT_FAMILIES.interRegular,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.1,
    fontStyle: 'italic',
    fixedLineHeight: 20,
  },
  translation: {
    fontFamily: FONT_FAMILIES.interRegular,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    fixedLineHeight: 26,
  },
  reference: {
    fontFamily: FONT_FAMILIES.interMedium,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.1,
    fixedLineHeight: 18,
  },
};

export function arabicLineHeight(
  fontSize: number,
  role: ArabicLineHeightRole,
): number {
  return Math.round(fontSize * ARABIC_LINE_HEIGHT_RATIO[role]);
}

export function getSacredTextStyle(
  role: SacredTextRole,
  fontScale = 1,
): TextStyle {
  const base = SACRED_SCALE[role];
  const fontSize = base.fontSize * fontScale;
  const lineHeight =
    base.fixedLineHeight != null
      ? base.fixedLineHeight * fontScale
      : arabicLineHeight(fontSize, base.lineHeightRole ?? 'arabic');

  return {
    fontFamily: base.fontFamily,
    fontSize,
    lineHeight,
    fontWeight: base.fontWeight,
    letterSpacing: base.letterSpacing,
    fontStyle: base.fontStyle,
    textAlign: role.endsWith('Arabic') ? 'right' : undefined,
    writingDirection:
      role === 'quranArabic' || role === 'duaArabic' || role === 'hadithArabic'
        ? 'rtl'
        : undefined,
  };
}

export function getUiTextStyle(
  variant: UiTextRole,
  locale: 'en' | 'ar' | 'ur' = 'en',
  fontScale = 1,
): TextStyle {
  const base = UI_SCALE[variant];
  const fontSize = base.fontSize * fontScale;
  const lineHeight = (base.lineHeight ?? fontSize) * fontScale;

  let fontFamily = base.fontFamily;
  let letterSpacing = base.letterSpacing ?? 0;

  if (locale === 'ar') {
    fontFamily = FONT_FAMILIES.notoNaskhArabic;
    letterSpacing = 0;
  } else if (locale === 'ur') {
    fontFamily = FONT_FAMILIES.notoNastaliqUrdu;
    letterSpacing = 0;
  }

  return {
    fontFamily,
    fontSize,
    lineHeight:
      locale === 'ar'
        ? arabicLineHeight(fontSize, 'arabic')
        : locale === 'ur'
          ? arabicLineHeight(fontSize, 'urdu')
          : lineHeight,
    fontWeight: base.fontWeight,
    letterSpacing,
    textTransform: variant === 'overline' ? 'uppercase' : undefined,
  };
}

export function getScriptFontFamily(
  script: 'latin' | 'arabic' | 'urdu' | 'quran',
): string {
  switch (script) {
    case 'quran':
      return FONT_FAMILIES.scheherazadeRegular;
    case 'arabic':
      return FONT_FAMILIES.amiriRegular;
    case 'urdu':
      return FONT_FAMILIES.notoNastaliqUrdu;
    default:
      return FONT_FAMILIES.interRegular;
  }
}

export function useFontScale(): number {
  return PixelRatio.getFontScale();
}

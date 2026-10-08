import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { getScriptFontFamily } from '@/theme/typographySystem';

type TextVariant =
  | 'displayLg'
  | 'displayMd'
  | 'headingLg'
  | 'headingMd'
  | 'headingSm'
  | 'bodyLg'
  | 'bodyMd'
  | 'bodySm'
  | 'caption'
  | 'label'
  | 'overline';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse' | 'error';
  weight?: '400' | '500' | '600' | '700';
  script?: 'latin' | 'arabic' | 'urdu' | 'quran';
}

export function Text({
  variant = 'bodyMd',
  color = 'primary',
  weight,
  script,
  style,
  children,
  ...rest
}: TextProps) {
  const { theme } = useTheme();
  const variantStyle = theme.typography[variant];

  const colorMap = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    tertiary: theme.colors.textTertiary,
    accent: theme.colors.accentPrimary,
    inverse: theme.colors.textInverse,
    error: theme.colors.error,
  };

  const scriptFontFamily = script ? getScriptFontFamily(script) : undefined;
  const resolvedWeight = weight ?? variantStyle.fontWeight;
  let fontFamily = theme.fontFamily.sans;
  if (scriptFontFamily) {
    fontFamily = scriptFontFamily;
  } else if (resolvedWeight === '500') {
    fontFamily = theme.fontFamily.sansMedium;
  } else if (resolvedWeight === '600' || resolvedWeight === '700') {
    fontFamily = theme.fontFamily.sansSemiBold;
  }

  return (
    <RNText
      style={[
        {
          color: colorMap[color],
          fontFamily,
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          fontWeight: resolvedWeight,
          letterSpacing:
            script && script !== 'latin'
              ? 0
              : 'letterSpacing' in variantStyle
                ? variantStyle.letterSpacing
                : undefined,
          textAlign:
            script === 'urdu' || script === 'arabic' ? 'right' : undefined,
          writingDirection:
            script === 'urdu' || script === 'arabic' || script === 'quran'
              ? 'rtl'
              : undefined,
          textTransform:
            'textTransform' in variantStyle ? variantStyle.textTransform : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export const textStyles = StyleSheet.create({});

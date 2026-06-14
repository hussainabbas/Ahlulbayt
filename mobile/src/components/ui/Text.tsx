import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

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
}

export function Text({
  variant = 'bodyMd',
  color = 'primary',
  weight,
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

  return (
    <RNText
      style={[
        {
          color: colorMap[color],
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          fontWeight: weight ?? variantStyle.fontWeight,
          letterSpacing:
            'letterSpacing' in variantStyle ? variantStyle.letterSpacing : undefined,
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

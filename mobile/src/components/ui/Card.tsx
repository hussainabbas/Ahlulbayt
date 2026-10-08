import { View, type ViewProps, StyleSheet } from 'react-native';

import { layout } from '@/theme/layout';
import { getShadow, type ShadowLevel } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

type CardVariant = 'elevated' | 'inset' | 'ghost';

interface CardProps extends ViewProps {
  padded?: boolean;
  variant?: CardVariant;
  shadow?: ShadowLevel;
}

export function Card({
  padded = true,
  variant = 'elevated',
  shadow = 'sm',
  style,
  children,
  ...rest
}: CardProps) {
  const { theme } = useTheme();

  const backgroundColor =
    variant === 'ghost'
      ? 'transparent'
      : variant === 'inset'
        ? theme.colors.backgroundSecondary
        : theme.colors.surfaceElevated;

  const shadowStyle =
    variant === 'elevated' && shadow !== 'none' ? getShadow(shadow, theme.scheme) : undefined;

  return (
    <View
      style={[
        styles.base,
        shadowStyle,
        {
          backgroundColor,
          borderColor: variant === 'ghost' ? 'transparent' : theme.colors.borderSubtle,
          padding: padded ? layout.screenPaddingX : 0,
          borderRadius: theme.radius.lg,
          borderWidth: variant === 'ghost' ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

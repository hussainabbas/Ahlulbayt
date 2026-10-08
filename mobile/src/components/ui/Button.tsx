import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

import { Spinner } from './Spinner';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  size?: 'md' | 'lg';
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  size = 'md',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.accentPrimary,
      borderColor: theme.colors.accentPrimary,
      labelColor: theme.colors.textInverse,
    },
    secondary: {
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.borderSubtle,
      labelColor: theme.colors.textPrimary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      labelColor: theme.colors.accentPrimary,
    },
  }[variant];

  const sizing = size === 'lg' ? styles.lg : styles.md;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        sizing,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          borderRadius: theme.radius.md,
          opacity: isDisabled ? 0.45 : state.pressed ? 0.88 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <Spinner size="small" color={variantStyles.labelColor} />
        ) : (
          <Text variant="headingSm" style={{ color: variantStyles.labelColor }}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    minHeight: 48,
    paddingHorizontal: 20,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: 24,
  },
  content: {
    minHeight: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

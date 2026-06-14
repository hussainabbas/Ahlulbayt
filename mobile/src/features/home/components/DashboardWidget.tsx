import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

interface DashboardWidgetProps extends ViewProps {
  label?: string;
  actionLabel?: string;
  onAction?: () => void;
  accentColor?: string;
  variant?: 'default' | 'inset' | 'ghost';
  children: React.ReactNode;
}

export function DashboardWidget({
  label,
  actionLabel,
  onAction,
  accentColor,
  variant = 'default',
  style,
  children,
  ...rest
}: DashboardWidgetProps) {
  const { theme } = useTheme();
  const shadow = variant === 'default' ? getShadow('xs', theme.scheme) : undefined;

  const bg =
    variant === 'ghost'
      ? 'transparent'
      : variant === 'inset'
        ? theme.colors.backgroundSecondary
        : theme.colors.surfaceElevated;

  return (
    <View
      style={[
        styles.root,
        shadow,
        {
          backgroundColor: bg,
          borderColor: variant === 'ghost' ? 'transparent' : theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          borderWidth: variant === 'ghost' ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
      {...rest}
    >
      {accentColor ? (
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
      ) : null}
      <View style={styles.inner}>
        {label ? (
          <View style={styles.header}>
            <Text variant="label" color="secondary">
              {label}
            </Text>
            {actionLabel && onAction ? (
              <Pressable onPress={onAction} hitSlop={8}>
                <Text variant="caption" color="accent">
                  {actionLabel}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 3,
  },
  inner: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Spinner } from '@/components/ui/Spinner';
import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

type AuthMethodVariant = 'google' | 'apple' | 'email' | 'register';

interface AuthMethodButtonProps {
  label: string;
  variant: AuthMethodVariant;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

function MethodIcon({ variant }: { variant: AuthMethodVariant }) {
  const { theme } = useTheme();

  if (variant === 'google') {
    return (
      <View style={styles.googleIcon}>
        <Text style={styles.googleG}>G</Text>
      </View>
    );
  }

  if (variant === 'apple') {
    return (
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.textPrimary }]}>
        <Text style={[styles.appleGlyph, { color: theme.colors.textInverse }]}></Text>
      </View>
    );
  }

  if (variant === 'email') {
    return (
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text style={[styles.emailGlyph, { color: theme.colors.accentPrimary }]}>✉</Text>
      </View>
    );
  }

  return (
    <View style={[styles.iconCircle, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Text style={[styles.emailGlyph, { color: theme.colors.textSecondary }]}>+</Text>
    </View>
  );
}

export function AuthMethodButton({
  label,
  variant,
  onPress,
  loading,
  disabled,
}: AuthMethodButtonProps) {
  const { theme } = useTheme();
  const isPrimary = variant === 'email';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        isPrimary
          ? { backgroundColor: theme.colors.accentPrimary, borderColor: theme.colors.accentPrimary }
          : {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
        (disabled || loading) && { opacity: 0.55 },
        pressed && !disabled && { opacity: 0.9 },
      ]}
    >
      {loading ? (
        <Spinner
          size="small"
          color={isPrimary ? theme.colors.textInverse : theme.colors.accentPrimary}
        />
      ) : (
        <>
          <MethodIcon variant={variant} />
          <Text
            variant="bodyMd"
            weight="600"
            style={{
              color: isPrimary ? theme.colors.textInverse : theme.colors.textPrimary,
              flex: 1,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
          <View style={styles.iconSpacer} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
    lineHeight: 20,
  },
  appleGlyph: {
    fontSize: 16,
    lineHeight: 20,
  },
  emailGlyph: {
    fontSize: 14,
    lineHeight: 18,
  },
  iconSpacer: {
    width: 28,
  },
});

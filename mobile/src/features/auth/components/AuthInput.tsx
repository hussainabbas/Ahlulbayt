import { forwardRef } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<TextInput, AuthInputProps>(function AuthInput(
  { label, error, style, ...rest },
  ref,
) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="bodySm" color="secondary" style={{ marginBottom: theme.spacing[2] }}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        placeholderTextColor={theme.colors.textTertiary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: error ? theme.colors.error : theme.colors.borderSubtle,
            color: theme.colors.textPrimary,
            borderRadius: theme.radius.lg,
            paddingHorizontal: theme.spacing[4],
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="bodySm" style={{ color: theme.colors.error, marginTop: theme.spacing[1] }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    fontSize: 16,
  },
});

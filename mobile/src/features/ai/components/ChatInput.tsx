import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface ChatInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={[styles.row, { borderTopColor: theme.colors.borderSubtle, backgroundColor: theme.colors.backgroundPrimary }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t('ai.inputPlaceholder')}
        placeholderTextColor={theme.colors.textTertiary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surfaceMuted,
            color: theme.colors.textPrimary,
            borderRadius: theme.radius.md,
          },
        ]}
        multiline
        maxLength={2000}
        editable={!disabled}
        onSubmitEditing={onSend}
      />
      <Pressable
        onPress={onSend}
        disabled={disabled || value.trim().length === 0}
        style={[
          styles.send,
          {
            backgroundColor: theme.colors.accentPrimaryMuted,
            opacity: disabled || value.trim().length === 0 ? 0.5 : 1,
          },
        ]}
      >
        <Text variant="bodySm" color="accent">
          {t('ai.send')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  send: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
});

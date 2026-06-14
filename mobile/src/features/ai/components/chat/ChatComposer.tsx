import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface ChatComposerProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatComposer({ value, onChange, onSend, disabled }: ChatComposerProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View
      style={[
        styles.root,
        {
          borderTopColor: theme.colors.borderSubtle,
          backgroundColor: theme.colors.backgroundPrimary,
        },
      ]}
    >
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={t('ai.inputPlaceholder')}
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          maxLength={2000}
          editable={!disabled}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              maxHeight: 120,
            },
          ]}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={canSend ? onSend : undefined}
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.send,
            {
              backgroundColor: canSend
                ? theme.colors.accentPrimary
                : theme.colors.surfaceMuted,
              opacity: pressed && canSend ? 0.88 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('ai.send')}
        >
          <Icon
            name="send"
            size={16}
            color={canSend ? theme.colors.textInverse : theme.colors.textTertiary}
          />
        </Pressable>
      </View>
      <Text variant="caption" color="tertiary" style={styles.hint}>
        {t('ai.disclaimerShort')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    paddingBottom: layout.listGap,
    gap: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: layout.listGap,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 8,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  hint: {
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: layout.blockGap,
  },
});

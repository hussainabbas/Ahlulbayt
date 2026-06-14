import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface MafatihSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
}

export function MafatihSearchBar({ value, onChangeText, onFocus }: MafatihSearchBarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="bodyMd" color="secondary">
        🔍
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={t('mafatih.search.placeholder')}
        placeholderTextColor={theme.colors.textTertiary}
        returnKeyType="search"
        style={[styles.input, { color: theme.colors.textPrimary }]}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
});

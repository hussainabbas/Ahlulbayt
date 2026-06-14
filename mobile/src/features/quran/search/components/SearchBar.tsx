import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, onSubmit, autoFocus }: SearchBarProps) {
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
      <Text variant="bodyMd" color="accent" style={styles.icon}>
        ✦
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        placeholder={t('quran.search.placeholder')}
        placeholderTextColor={theme.colors.textTertiary}
        returnKeyType="search"
        style={[styles.input, { color: theme.colors.textPrimary }]}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

interface ExampleChipProps {
  label: string;
  onPress: () => void;
}

export function ExampleChip({ label, onPress }: ExampleChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: 14,
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});

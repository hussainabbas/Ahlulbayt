import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface DuaSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function DuaSearchBar({ value, onChangeText }: DuaSearchBarProps) {
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
      <Icon name="search" size={16} color={theme.colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t('dua.searchPlaceholder')}
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
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 46,
    paddingHorizontal: layout.blockGap + 2,
    gap: layout.listGap,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
});

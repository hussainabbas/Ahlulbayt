import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { QUICK_PROMPTS } from '../constants/quickPrompts';

interface QuickPromptChipsProps {
  onSelect: (messageKey: string) => void;
  disabled?: boolean;
}

export function QuickPromptChips({ onSelect, disabled }: QuickPromptChipsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {QUICK_PROMPTS.map((prompt) => (
        <Pressable
          key={prompt.id}
          disabled={disabled}
          onPress={() => onSelect(prompt.messageKey)}
          style={[
            styles.chip,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text variant="caption" color="secondary">
            {t(prompt.labelKey)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: layout.listGap,
    paddingVertical: layout.listGap,
    paddingHorizontal: layout.screenPaddingX,
  },
  chip: {
    paddingHorizontal: layout.blockGap,
    paddingVertical: layout.listGap,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

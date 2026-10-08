import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { QUICK_PROMPTS } from '../../constants/quickPrompts';

interface SuggestedPromptStripProps {
  onSelect: (messageKey: string) => void;
  disabled?: boolean;
}

/** Compact horizontal prompts above the composer during active chats. */
export function SuggestedPromptStrip({ onSelect, disabled }: SuggestedPromptStripProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { borderTopColor: theme.colors.borderSubtle }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {QUICK_PROMPTS.map((prompt) => (
          <Pressable
            key={prompt.id}
            disabled={disabled}
            onPress={() => onSelect(prompt.messageKey)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
                opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text variant="caption" color="accent" weight="500" numberOfLines={1}>
              {t(prompt.labelKey)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: layout.listGap,
  },
  scroll: {
    paddingHorizontal: layout.screenPaddingX,
    gap: layout.listGap,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

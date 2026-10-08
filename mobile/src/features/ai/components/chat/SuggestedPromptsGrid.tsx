import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { QUICK_PROMPTS } from '../../constants/quickPrompts';

interface SuggestedPromptsGridProps {
  onSelect: (messageKey: string) => void;
  disabled?: boolean;
}

export function SuggestedPromptsGrid({ onSelect, disabled }: SuggestedPromptsGridProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="label" color="secondary" style={styles.heading}>
        {t('ai.suggestedPrompts')}
      </Text>
      <View style={styles.grid}>
        {QUICK_PROMPTS.map((prompt) => (
          <Pressable
            key={prompt.id}
            disabled={disabled}
            onPress={() => onSelect(prompt.messageKey)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
                opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t(prompt.labelKey)}
          >
            <View style={[styles.cardAccent, { backgroundColor: theme.colors.accentGold }]} />
            <Text variant="bodySm" weight="500" numberOfLines={2}>
              {t(prompt.labelKey)}
            </Text>
            <Text variant="caption" color="tertiary" numberOfLines={2} style={styles.cardHint}>
              {t('ai.tapToAsk')}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.blockGap,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.blockGap,
  },
  heading: {
    paddingHorizontal: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.listGap,
  },
  card: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: '47%',
    minHeight: 92,
    padding: layout.blockGap,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  cardHint: {
    marginTop: 6,
  },
});

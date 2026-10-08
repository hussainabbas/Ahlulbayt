import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { AiAction } from '../types';

interface AiActionCardsProps {
  actions: AiAction[];
  onAction: (action: AiAction) => void;
}

export function AiActionCards({ actions, onAction }: AiActionCardsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (actions.length === 0) return null;

  const label = (action: AiAction) =>
    action.labelKey.startsWith('ai.') ? t(action.labelKey) : action.labelKey;

  return (
    <View style={styles.row}>
      {actions.map((action, i) => (
        <Pressable
          key={`${action.type}-${i}`}
          onPress={() => onAction(action)}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
              borderColor: theme.colors.accentPrimary,
            },
          ]}
        >
          <Text variant="caption" color="accent" numberOfLines={2}>
            {label(action)} ›
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    maxWidth: 200,
  },
});

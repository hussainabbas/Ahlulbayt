import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface QuickActionChipProps {
  labelKey: string;
  icon: string;
  onPress: () => void;
}

export function QuickActionChip({ labelKey, icon, onPress }: QuickActionChipProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: theme.colors.accentPrimaryMuted,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text variant="caption" color="accent" numberOfLines={1}>
        {t(labelKey)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
  },
});

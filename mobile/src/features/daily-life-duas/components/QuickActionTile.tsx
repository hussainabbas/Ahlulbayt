import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface QuickActionTileProps {
  labelKey: string;
  icon: string;
  tint: string;
  onPress: () => void;
}

export function QuickActionTile({ labelKey, icon, tint, onPress }: QuickActionTileProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: tint }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text variant="caption" color="primary" weight="600" numberOfLines={2} style={styles.label}>
        {t(labelKey)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    textAlign: 'center',
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { MORE_QUICK_ACTIONS, type MoreMenuItem } from '../constants/menuConfig';
import { MenuItemIcon } from './MenuItemIcon';

interface MoreQuickActionsProps {
  onPress: (item: MoreMenuItem) => void;
}

export function MoreQuickActions({ onPress }: MoreQuickActionsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('more.quickAccess')}
      </Text>
      <View style={styles.grid}>
        {MORE_QUICK_ACTIONS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => onPress(item)}
            style={({ pressed }) => [
              styles.tile,
              {
                backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <View style={styles.iconSlot}>
              <MenuItemIcon itemKey={item.key} variant="tile" />
            </View>
            <Text variant="caption" weight="600" numberOfLines={2} style={styles.label}>
              {t(`more.${item.key}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const ICON_SLOT = 48;

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    minWidth: '46%',
    minHeight: 108,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconSlot: {
    width: ICON_SLOT,
    height: ICON_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    minHeight: 32,
  },
});

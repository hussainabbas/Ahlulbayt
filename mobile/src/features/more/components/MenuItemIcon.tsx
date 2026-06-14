import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { MENU_ICON_CONFIG, type MoreMenuKey } from '../constants/menuConfig';

interface MenuItemIconProps {
  itemKey: MoreMenuKey;
}

const SIZE = {
  md: { wrap: 36, icon: 16, label: 13, radius: 10 },
  lg: { wrap: 44, icon: 20, label: 18, radius: 12 },
} as const;

export function MenuItemIcon({ itemKey }: MenuItemIconProps) {
  const { theme } = useTheme();
  const config = MENU_ICON_CONFIG[itemKey];
  const dim = SIZE[config.size ?? 'md'];

  const palette = {
    accent: {
      bg: theme.colors.accentPrimaryMuted,
      fg: theme.colors.accentPrimary,
    },
    gold: {
      bg: 'rgba(212, 184, 122, 0.18)',
      fg: '#A8843A',
    },
    muted: {
      bg: theme.colors.surfaceMuted,
      fg: theme.colors.textSecondary,
    },
    rose: {
      bg: 'rgba(139, 58, 58, 0.12)',
      fg: '#8B3A3A',
    },
  }[config.tone];

  return (
    <View
      style={[
        styles.wrap,
        {
          width: dim.wrap,
          height: dim.wrap,
          borderRadius: dim.radius,
          backgroundColor: palette.bg,
        },
      ]}
    >
      {config.icon ? (
        <Icon name={config.icon} size={dim.icon} color={palette.fg} />
      ) : (
        <Text
          variant="caption"
          weight="600"
          style={{ color: palette.fg, fontSize: dim.label, lineHeight: dim.label + 4 }}
        >
          {config.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

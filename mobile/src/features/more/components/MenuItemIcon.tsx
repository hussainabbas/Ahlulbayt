import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { MENU_ICON_CONFIG, type MoreMenuKey } from '../constants/menuConfig';

export type MenuItemIconVariant = 'list' | 'tile';

interface MenuItemIconProps {
  itemKey: MoreMenuKey;
  variant?: MenuItemIconVariant;
}

/** Unified icon metrics — list rows and quick-action tiles each get one consistent size. */
const SIZE = {
  list: { wrap: 40, icon: 18, label: 15, radius: 10 },
  tile: { wrap: 48, icon: 22, label: 17, radius: 12 },
} as const;

export function MenuItemIcon({ itemKey, variant = 'list' }: MenuItemIconProps) {
  const { theme } = useTheme();
  const config = MENU_ICON_CONFIG[itemKey];
  const dim = SIZE[variant];

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
          weight="700"
          style={[
            styles.glyph,
            {
              color: palette.fg,
              fontSize: dim.label,
              lineHeight: dim.label + 2,
            },
          ]}
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
  glyph: {
    includeFontPadding: false,
    textAlign: 'center',
  },
});

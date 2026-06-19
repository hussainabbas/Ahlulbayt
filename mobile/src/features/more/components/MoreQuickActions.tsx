import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { MORE_QUICK_ACTIONS, type MoreMenuItem } from '../constants/menuConfig';

interface MoreQuickActionsProps {
  onPress: (item: MoreMenuItem) => void;
}

const ICON_SLOT = 52;

/** Uniform quick-access visuals — same circle size and accent tone for every tile. */
const QUICK_VISUAL: Record<
  MoreMenuItem['key'],
  { kind: 'icon'; name: 'book' } | { kind: 'label'; label: string } | { kind: 'emoji'; emoji: string }
> = {
  mafatih: { kind: 'icon', name: 'book' },
  tasbih: { kind: 'label', label: '33' },
  calendar: { kind: 'emoji', emoji: '📅' },
  qibla: { kind: 'emoji', emoji: '🕋' },
};

export function MoreQuickActions({ onPress }: MoreQuickActionsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="overline" color="secondary">
        {t('more.quickAccess')}
      </Text>
      <View style={styles.grid}>
        {MORE_QUICK_ACTIONS.map((item) => {
          const visual = QUICK_VISUAL[item.key];

          return (
            <Pressable
              key={item.key}
              onPress={() => onPress(item)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.tile,
                {
                  backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                  borderRadius: theme.radius.lg,
                },
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.accentPrimaryMuted },
                ]}
              >
                {visual.kind === 'icon' ? (
                  <Icon name={visual.name} size={24} color={theme.colors.accentPrimary} />
                ) : visual.kind === 'emoji' ? (
                  <Text style={styles.emoji}>{visual.emoji}</Text>
                ) : (
                  <Text
                    variant="caption"
                    weight="700"
                    style={[styles.glyph, { color: theme.colors.accentPrimary }]}
                  >
                    {visual.label}
                  </Text>
                )}
              </View>
              <Text variant="caption" weight="600" numberOfLines={2} style={styles.label}>
                {t(`more.${item.key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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
    width: '47.5%',
    minHeight: 118,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: ICON_SLOT,
    height: ICON_SLOT,
    borderRadius: ICON_SLOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 30,
    textAlign: 'center',
  },
  glyph: {
    fontSize: 22,
    lineHeight: 26,
    includeFontPadding: false,
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
    minHeight: 32,
  },
});

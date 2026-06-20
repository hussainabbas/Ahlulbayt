import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { SupporterTier } from '../types';

interface SupporterBadgeProps {
  tier: SupporterTier;
}

const TIER_KEYS: Record<SupporterTier, string> = {
  supporter: 'support.badge.supporter',
  gold: 'support.badge.gold',
  founding: 'support.badge.founding',
};

const TIER_EMOJI: Record<SupporterTier, string> = {
  supporter: '💚',
  gold: '⭐',
  founding: '🏆',
};

export function SupporterBadge({ tier }: SupporterBadgeProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: theme.radius.full,
        },
      ]}
    >
      <Text variant="caption" weight="600">
        {TIER_EMOJI[tier]} {t(TIER_KEYS[tier])}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});

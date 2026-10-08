import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_ICONS } from '../data/catalog';
import type { ScoredRecommendation } from '../types';

interface RecommendationCardProps {
  recommendation: ScoredRecommendation;
  onPress: () => void;
  onDismiss?: () => void;
}

export function RecommendationCard({ recommendation, onPress, onDismiss }: RecommendationCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { item, reasonKey } = recommendation;
  const icon = CATEGORY_ICONS[item.category] ?? '✨';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text variant="headingMd">{icon}</Text>
        {onDismiss ? (
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Text variant="caption" color="tertiary">
              ×
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text variant="caption" color="accent" style={{ marginTop: 6 }}>
        {t(`recommendations.categories.${item.category}`)}
      </Text>
      <Text variant="headingSm" numberOfLines={2} style={{ marginTop: 4 }}>
        {t(item.titleKey)}
      </Text>
      <Text variant="caption" color="secondary" numberOfLines={2} style={{ marginTop: 4 }}>
        {t(item.subtitleKey)}
      </Text>
      <View style={[styles.reason, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Text variant="caption" color="tertiary" numberOfLines={1}>
          {t(reasonKey)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 188,
    padding: 14,
    borderWidth: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reason: {
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import {
  CATEGORY_ICON_GLYPH,
  CATEGORY_TINT,
} from '../constants/categoryVisuals';
import type { DailyLifeCategory } from '../types';

interface CategoryGridCardProps {
  category: DailyLifeCategory;
  onPress: () => void;
}

export function CategoryGridCard({ category, onPress }: CategoryGridCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? category.titles.ur : locale === 'ar' ? category.titles.ar : category.titles.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: CATEGORY_TINT[category.id] }]}>
          <Text style={styles.icon}>{CATEGORY_ICON_GLYPH[category.icon] ?? '✦'}</Text>
        </View>
        <View style={[styles.countPill, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text variant="caption" color="secondary" weight="600">
            {t('dailyLifeDuas.categoryCount', { count: category.situations.length })}
          </Text>
        </View>
      </View>

      <Text variant="label" numberOfLines={2} style={styles.title}>
        {title}
      </Text>

      <View style={styles.footer}>
        <Text variant="caption" color="accent">
          {t('dailyLifeDuas.browse')}
        </Text>
        <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  title: {
    flexShrink: 1,
    minHeight: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

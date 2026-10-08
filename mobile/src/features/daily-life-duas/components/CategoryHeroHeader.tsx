import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_ICON_GLYPH,
  CATEGORY_TINT,
} from '../constants/categoryVisuals';
import type { DailyLifeCategory } from '../types';
import { pickLocalized } from '../utils/localizedContent';

interface CategoryHeroHeaderProps {
  category: DailyLifeCategory;
  duaCount: number;
}

export function CategoryHeroHeader({ category, duaCount }: CategoryHeroHeaderProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const description = pickLocalized(CATEGORY_DESCRIPTIONS[category.id], locale);
  const tint = CATEGORY_TINT[category.id];

  return (
    <LinearGradient
      colors={[tint, 'rgba(184, 149, 107, 0.06)', theme.colors.backgroundPrimary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.wrap,
        {
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: tint }]}>
        <Text style={styles.icon}>{CATEGORY_ICON_GLYPH[category.icon] ?? '✦'}</Text>
      </View>

      <View style={styles.textCol}>
        <Text variant="bodySm" color="secondary">
          {description}
        </Text>
        <View style={[styles.countPill, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="caption" color="accent" weight="600">
            {t('dailyLifeDuas.categorySupplications', { count: duaCount })}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: layout.blockGap + 4,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
  textCol: {
    flex: 1,
    gap: 10,
  },
  countPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
});

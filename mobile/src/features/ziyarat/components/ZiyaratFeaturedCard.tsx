import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { OCCASION_LABELS } from '../constants/catalog';
import type { ZiyaratMeta } from '../types';

interface ZiyaratFeaturedCardProps {
  meta: ZiyaratMeta;
  onPress: () => void;
}

export function ZiyaratFeaturedCard({ meta, onPress }: ZiyaratFeaturedCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const desc = locale === 'ur' ? meta.description.ur : meta.description.en;
  const time =
    locale === 'ur'
      ? meta.recommendedTime.ur
      : locale === 'ar'
        ? meta.recommendedTime.ar
        : meta.recommendedTime.en;
  const occasion = OCCASION_LABELS[meta.occasion];
  const occasionLabel =
    locale === 'ur' ? occasion.ur : locale === 'ar' ? occasion.ar : occasion.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.94 }]}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.card,
          {
            borderColor: theme.colors.accentGold,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surfaceElevated,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('ziyarat.featured')}
          </Text>
          <Text variant="headingSm" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {desc}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.meta}>
            {occasionLabel} · {time}
          </Text>
        </View>
        <View style={styles.chevron}>
          <Icon name="chevron" size={18} color={theme.colors.accentGold} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginTop: layout.sectionGap,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  body: {
    flex: 1,
    padding: layout.blockGap + 2,
    gap: 4,
  },
  title: {
    marginTop: 2,
  },
  meta: {
    marginTop: 4,
  },
  chevron: {
    justifyContent: 'center',
    paddingRight: layout.blockGap,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { DuaMeta } from '../types';

interface DuaFeaturedCardProps {
  meta: DuaMeta;
  onPress: () => void;
}

export function DuaFeaturedCard({ meta, onPress }: DuaFeaturedCardProps) {
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
            borderColor: theme.colors.accentPrimary,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surfaceElevated,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('dua.featured')}
          </Text>
          <Text variant="headingSm" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {desc}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.meta}>
            {time} · {meta.estimatedMinutes} min
          </Text>
        </View>
        <View style={styles.chevron}>
          <Icon name="chevron" size={18} color={theme.colors.accentPrimary} />
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

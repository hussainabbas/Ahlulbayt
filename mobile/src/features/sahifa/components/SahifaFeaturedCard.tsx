import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { SahifaMeta } from '../types';

interface SahifaFeaturedCardProps {
  meta: SahifaMeta;
  onPress: () => void;
}

export function SahifaFeaturedCard({ meta, onPress }: SahifaFeaturedCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const subtitle = locale === 'ur' ? meta.description.ur : meta.description.en;

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
        <View style={[styles.accent, { backgroundColor: theme.colors.accentPrimary }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('sahifa.featured')}
          </Text>
          <Text variant="headingSm" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.meta}>
            {t('sahifa.entryMeta', {
              number: meta.number,
              minutes: meta.estimatedMinutes,
              sections: meta.sectionCount,
            })}
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

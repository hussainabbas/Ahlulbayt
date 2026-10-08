import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { SOURCE_BY_ID } from '../constants/catalog';
import type { HadithEntry } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithFeaturedCardProps {
  entry: HadithEntry;
  onPress: () => void;
}

export function HadithFeaturedCard({ entry, onPress }: HadithFeaturedCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const sourceMeta = SOURCE_BY_ID[entry.source];

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
        <View style={[styles.accent, { backgroundColor: sourceMeta.accentColor }]} />
        <View style={styles.body}>
          <Text variant="overline" color="accent">
            {t('hadith.featured')}
          </Text>
          <Text variant="headingSm" style={styles.title}>
            {pickLocalized(entry.title, locale)}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {pickLocalized(entry.summary, locale)}
          </Text>
          <Text variant="caption" color="tertiary" style={styles.meta}>
            {sourceMeta.icon} {t(sourceMeta.nameKey)}
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

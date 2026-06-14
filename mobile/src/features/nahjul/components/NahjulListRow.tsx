import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { NahjulMeta } from '../types';

interface NahjulListRowProps {
  meta: NahjulMeta;
  bookmarked?: boolean;
  offline?: boolean;
  onPress: () => void;
}

const CATEGORY_LABEL: Record<NahjulMeta['category'], string> = {
  sermon: 'nahjul.categories.sermons',
  letter: 'nahjul.categories.letters',
  saying: 'nahjul.categories.quotes',
};

export function NahjulListRow({ meta, bookmarked, offline, onPress }: NahjulListRowProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  const title =
    locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
  const excerpt = locale === 'ur' ? meta.excerpt.ur : meta.excerpt.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
            <Text variant="caption" color="accent">
              {t(CATEGORY_LABEL[meta.category])}
            </Text>
          </View>
          <View style={styles.badges}>
            {bookmarked ? <Text variant="caption" color="accent">★</Text> : null}
            {offline ? (
              <View style={[styles.offlineBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
                <Text variant="caption" color="accent">↓</Text>
              </View>
            ) : null}
          </View>
        </View>
        <Text variant="headingSm">{title}</Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2}>
          {excerpt}
        </Text>
        <Text variant="caption" color="tertiary">
          #{meta.number} · {meta.estimatedMinutes} min
        </Text>
      </View>
      <Text variant="bodyMd" color="tertiary">›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  content: { flex: 1, gap: 4 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badges: { flexDirection: 'row', gap: 6 },
  offlineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
});

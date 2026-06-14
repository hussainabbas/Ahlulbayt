import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { PrayerAcademyFeaturedCard } from '../components/PrayerAcademyFeaturedCard';
import { PrayerCatalogRow } from '../components/PrayerCatalogRow';
import { PRAYER_CATEGORY_ORDER } from '../constants/catalog';
import { PrayerAcademyRepository } from '../engine/prayerAcademyRepository';
import { usePrayerAcademyBookmarkStore } from '../stores/bookmarkStore';
import { usePrayerAcademyProgressStore } from '../stores/progressStore';
import type { PrayerAcademyCategory, PrayerAcademyMeta } from '../types';

type Filter = 'all' | 'bookmarked';

const FEATURED_ID = 'salat_fajr';

export function PrayerAcademyHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const bookmarks = usePrayerAcademyBookmarkStore((s) => s.bookmarks);
  const byPrayer = usePrayerAcademyProgressStore((s) => s.byPrayer);

  const featured = useMemo(() => PrayerAcademyRepository.getMeta(FEATURED_ID), []);

  const catalog = useMemo(() => {
    let list =
      query.trim().length >= 2
        ? PrayerAcademyRepository.searchCatalog(query)
        : PrayerAcademyRepository.listCatalog();

    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.stepId).map((b) => b.prayerId));
      list = list.filter((m) => ids.has(m.id));
    }
    return list;
  }, [filter, bookmarks, query]);

  const grouped = useMemo(() => {
    const map = new Map<PrayerAcademyCategory, PrayerAcademyMeta[]>();
    for (const cat of PRAYER_CATEGORY_ORDER) map.set(cat, []);
    for (const item of catalog) {
      map.get(item.category)?.push(item);
    }
    return PRAYER_CATEGORY_ORDER.filter((cat) => (map.get(cat)?.length ?? 0) > 0).map(
      (cat) => ({ category: cat, items: map.get(cat)! }),
    );
  }, [catalog]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('prayerAcademy.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const openGuide = useCallback(
    (prayerId: PrayerAcademyMeta['id']) => {
      navigation.navigate('PrayerAcademyGuide', { prayerId });
    },
    [navigation],
  );

  return (
    <Screen scroll>
      <Text variant="bodySm" color="secondary">
        {t('prayerAcademy.subtitle')}
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('prayerAcademy.searchPlaceholder')}
        placeholderTextColor={theme.colors.textTertiary}
        style={[
          styles.search,
          {
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      />

      <SegmentControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: t('prayerAcademy.filter.all') },
          { value: 'bookmarked', label: t('prayerAcademy.filter.bookmarked') },
        ]}
      />

      {featured && filter === 'all' && !query.trim() ? (
        <PrayerAcademyFeaturedCard meta={featured} onPress={() => openGuide(featured.id)} />
      ) : null}

      {grouped.length === 0 ? (
        <EmptyState title={t('prayerAcademy.empty')} />
      ) : (
        grouped.map(({ category, items }) => (
          <View key={category} style={styles.section}>
            <Text variant="label" color="secondary">
              {t(`prayerAcademy.categories.${category}`)}
            </Text>
            <View style={styles.list}>
              {items.map((item) => (
                <PrayerCatalogRow
                  key={item.id}
                  meta={item}
                  bookmarked={bookmarks.some((b) => b.prayerId === item.id && !b.stepId)}
                  completed={!!byPrayer[item.id]?.completedAt}
                  onPress={() => openGuide(item.id)}
                />
              ))}
            </View>
          </View>
        ))
      )}

      <Text variant="caption" color="tertiary" style={styles.disclaimer}>
        {t('prayerAcademy.disclaimer')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginTop: layout.listGap,
  },
  section: { gap: layout.listGap, marginTop: layout.sectionGap },
  list: { gap: layout.listGap },
  disclaimer: { marginTop: layout.sectionGap, lineHeight: 18 },
});

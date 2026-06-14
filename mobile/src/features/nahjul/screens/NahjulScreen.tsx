import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { NahjulCategoryTabs } from '../components/NahjulCategoryTabs';
import { NahjulListRow } from '../components/NahjulListRow';
import { NahjulQuoteCard } from '../components/NahjulQuoteCard';
import { NAHJUL_RECITERS } from '../constants/catalog';
import { NahjulRepository } from '../engine/nahjulRepository';
import { useNahjulSearch } from '../hooks/useNahjulSearch';
import { useNahjulBookmarkStore } from '../stores/nahjulBookmarkStore';
import { useNahjulDownloadStore } from '../stores/nahjulDownloadStore';
import type { NahjulCategory, NahjulId, NahjulMeta } from '../types';

type ListFilter = 'all' | 'bookmarked';

export function NahjulScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [category, setCategory] = useState<NahjulCategory | 'all'>('all');
  const [listFilter, setListFilter] = useState<ListFilter>('all');

  const { query, setQuery, results, isSearching } = useNahjulSearch(category);
  const bookmarks = useNahjulBookmarkStore((s) => s.bookmarks);
  const toggleBookmark = useNahjulBookmarkStore((s) => s.toggleBookmark);
  const downloads = useNahjulDownloadStore((s) => s.downloads);
  const defaultReciter = NAHJUL_RECITERS[0].id;

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.nahjulId)),
    [bookmarks],
  );

  const offlineIds = useMemo(
    () =>
      new Set(
        Object.values(downloads)
          .filter((d) => d.reciterId === defaultReciter)
          .map((d) => d.nahjulId),
      ),
    [downloads, defaultReciter],
  );

  const listData = useMemo((): NahjulMeta[] => {
    if (isSearching) {
      return results
        .map((r) => NahjulRepository.getMeta(r.id))
        .filter((m): m is NahjulMeta => m != null);
    }

    let items =
      category === 'all' ? NahjulRepository.listAll() : NahjulRepository.listByCategory(category);

    if (listFilter === 'bookmarked') {
      items = items.filter((m) => bookmarkedIds.has(m.id));
    }

    return items;
  }, [isSearching, results, category, listFilter, bookmarkedIds]);

  const featuredQuotes = useMemo(() => NahjulRepository.getFeaturedQuotes(6), []);

  const openReader = (id: NahjulId) => {
    navigation.navigate('NahjulReader', { nahjulId: id });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('nahjul.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  const showQuotesGrid = !isSearching && category === 'saying' && listFilter === 'all';

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="displayMd">{t('nahjul.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('nahjul.subtitle')}
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('nahjul.searchPlaceholder')}
          placeholderTextColor={theme.colors.textTertiary}
          style={[
            styles.search,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
              color: theme.colors.textPrimary,
            },
          ]}
        />

        {!isSearching ? (
          <>
            <NahjulCategoryTabs active={category} onChange={setCategory} />
            <View style={styles.filters}>
              {(['all', 'bookmarked'] as const).map((f) => {
                const active = listFilter === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setListFilter(f)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: active
                          ? theme.colors.accentPrimaryMuted
                          : theme.colors.surfaceMuted,
                        borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text variant="caption" color={active ? 'accent' : 'secondary'}>
                      {t(f === 'all' ? 'nahjul.filterAll' : 'nahjul.filterBookmarked')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}
      </View>

      {!isSearching && category === 'all' && listFilter === 'all' ? (
        <View style={[styles.featured, { paddingHorizontal: theme.spacing[5] }]}>
          <Text variant="overline" color="secondary">
            {t('nahjul.featuredQuotes')}
          </Text>
          {featuredQuotes.map((q) => (
            <NahjulQuoteCard
              key={q.id}
              meta={q}
              bookmarked={bookmarkedIds.has(q.id)}
              onPress={() => openReader(q.id)}
              onToggleBookmark={() => toggleBookmark(q.id, q.titles.en)}
            />
          ))}
        </View>
      ) : null}

      <Card padded={false} style={styles.listCard}>
        {showQuotesGrid ? (
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.listContent, { paddingHorizontal: 12 }]}
            renderItem={({ item }) => (
              <NahjulQuoteCard
                meta={item}
                bookmarked={bookmarkedIds.has(item.id)}
                onPress={() => openReader(item.id)}
                onToggleBookmark={() => toggleBookmark(item.id, item.titles.en)}
              />
            )}
            ListEmptyComponent={
              <Text variant="bodyMd" color="secondary" style={styles.empty}>
                {t('nahjul.noResults')}
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NahjulListRow
                meta={item}
                bookmarked={bookmarkedIds.has(item.id)}
                offline={offlineIds.has(item.id)}
                onPress={() => openReader(item.id)}
              />
            )}
            ListEmptyComponent={
              <Text variant="bodyMd" color="secondary" style={styles.empty}>
                {isSearching ? t('nahjul.noResults') : t('nahjul.noBookmarks')}
              </Text>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  search: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  featured: {
    gap: 8,
    marginBottom: 8,
  },
  listCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  empty: {
    padding: 24,
    textAlign: 'center',
  },
});

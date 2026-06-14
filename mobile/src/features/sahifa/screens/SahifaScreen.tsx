import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { SahifaFeaturedCard } from '../components/SahifaFeaturedCard';
import { SahifaListRow } from '../components/SahifaListRow';
import { SahifaSearchBar } from '../components/SahifaSearchBar';
import { getSahifaMetaByNumber, SAHIFA_RECITERS } from '../constants/catalog';
import { SahifaRepository } from '../engine/sahifaRepository';
import { useSahifaBookmarkStore } from '../stores/sahifaBookmarkStore';
import { useSahifaDownloadStore } from '../stores/sahifaDownloadStore';
import type { SahifaMeta } from '../types';

type Filter = 'all' | 'bookmarked';

export function SahifaScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const bookmarks = useSahifaBookmarkStore((s) => s.bookmarks);
  const downloads = useSahifaDownloadStore((s) => s.downloads);
  const defaultReciter = SAHIFA_RECITERS[0].id;
  const featured = useMemo(() => getSahifaMetaByNumber(1), []);

  const showingSearch = query.trim().length >= 2;

  const supplications = useMemo(() => {
    let list = showingSearch ? SahifaRepository.search(query) : SahifaRepository.listAll();

    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.sahifaId));
      list = list.filter((s) => ids.has(s.id));
    }

    return list;
  }, [filter, bookmarks, query, showingSearch]);

  const offlineIds = useMemo(() => {
    return new Set(
      Object.values(downloads)
        .filter((d) => d.reciterId === defaultReciter)
        .map((d) => d.sahifaId),
    );
  }, [downloads, defaultReciter]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.sahifaId)),
    [bookmarks],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('sahifa.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const openReader = useCallback(
    (sahifaId: SahifaMeta['id']) => {
      navigation.navigate('SahifaReader', { sahifaId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: SahifaMeta; index: number }) => (
      <View
        style={[
          styles.entryRowWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderTopLeftRadius: index === 0 ? theme.radius.lg : 0,
            borderTopRightRadius: index === 0 ? theme.radius.lg : 0,
            borderBottomLeftRadius: index === supplications.length - 1 ? theme.radius.lg : 0,
            borderBottomRightRadius: index === supplications.length - 1 ? theme.radius.lg : 0,
            borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: index === supplications.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <SahifaListRow
          meta={item}
          bookmarked={bookmarkedIds.has(item.id)}
          offline={offlineIds.has(item.id)}
          isLast={index === supplications.length - 1}
          onPress={() => openReader(item.id)}
        />
      </View>
    ),
    [bookmarkedIds, offlineIds, openReader, supplications.length, theme],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('sahifa.subtitle')}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('sahifa.source')}
        </Text>

        <SahifaSearchBar value={query} onChangeText={setQuery} />

        {featured && !showingSearch && filter === 'all' ? (
          <SahifaFeaturedCard meta={featured} onPress={() => openReader(featured.id)} />
        ) : null}

        {!showingSearch ? (
          <View style={styles.filters}>
            {(['all', 'bookmarked'] as const).map((value) => {
              const active = filter === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setFilter(value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active
                        ? theme.colors.accentPrimaryMuted
                        : theme.colors.surfaceMuted,
                      borderColor: active
                        ? theme.colors.accentPrimary
                        : theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text variant="caption" color={active ? 'accent' : 'secondary'}>
                    {t(value === 'all' ? 'sahifa.filterAll' : 'sahifa.filterBookmarked')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Text variant="overline" color="secondary" style={styles.listLabel}>
          {showingSearch
            ? t('sahifa.searchResults', { count: supplications.length })
            : t('sahifa.allEntries', { count: supplications.length })}
        </Text>
      </View>
    ),
    [
      featured,
      filter,
      openReader,
      query,
      showingSearch,
      supplications.length,
      t,
      theme,
    ],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <FlatList
        style={styles.list}
        data={supplications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState
              title={showingSearch ? t('sahifa.noResults') : t('sahifa.noBookmarks')}
              subtitle={t('common.emptySubtitle')}
            />
          </Card>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={14}
        removeClippedSubviews={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    paddingBottom: layout.blockGap,
    gap: 4,
  },
  subtitle: {
    maxWidth: '92%',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: layout.sectionGap,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  listLabel: {
    marginTop: layout.sectionGap,
  },
  entryRowWrap: {
    marginHorizontal: layout.screenPaddingX,
    overflow: 'hidden',
  },
  emptyCard: {
    marginHorizontal: layout.screenPaddingX,
  },
  listContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
});

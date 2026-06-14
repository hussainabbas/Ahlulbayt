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

import { MasoomeenGridCard } from '../components/MasoomeenGridCard';
import { MasoomeenSearchBar } from '../components/MasoomeenSearchBar';
import { MasoomeenRepository } from '../engine/masoomeenRepository';
import { useMasoomeenSearch } from '../hooks/useMasoomeenSearch';
import { useMasoomeenBookmarkStore } from '../stores/masoomeenBookmarkStore';
import type { MasoomeenId, MasoomeenMeta } from '../types';

type ListFilter = 'all' | 'bookmarked';

export function MasoomeenHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [listFilter, setListFilter] = useState<ListFilter>('all');

  const { query, setQuery, results, isSearching } = useMasoomeenSearch();
  const bookmarks = useMasoomeenBookmarkStore((s) => s.bookmarks);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.masoomeenId)),
    [bookmarks],
  );

  const listData = useMemo((): MasoomeenMeta[] => {
    if (isSearching) {
      return results
        .map((r) => MasoomeenRepository.getMeta(r.id))
        .filter((m): m is MasoomeenMeta => m != null);
    }

    let items = MasoomeenRepository.listAll();
    if (listFilter === 'bookmarked') {
      items = items.filter((m) => bookmarkedIds.has(m.id));
    }
    return items;
  }, [isSearching, results, listFilter, bookmarkedIds]);

  const openProfile = useCallback(
    (id: MasoomeenId) => {
      navigation.navigate('MasoomeenProfile', { masoomeenId: id });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('masoomeen.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const renderItem = useCallback(
    ({ item }: { item: MasoomeenMeta }) => (
      <View style={styles.cell}>
        <MasoomeenGridCard
          meta={item}
          bookmarked={bookmarkedIds.has(item.id)}
          onPress={() => openProfile(item.id)}
        />
      </View>
    ),
    [bookmarkedIds, openProfile],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('masoomeen.subtitle')}
        </Text>

        <MasoomeenSearchBar value={query} onChangeText={setQuery} />

        {!isSearching ? (
          <View style={styles.filters}>
            {(['all', 'bookmarked'] as const).map((filter) => {
              const active = listFilter === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setListFilter(filter)}
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
                    {t(`masoomeen.filter.${filter}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Text variant="overline" color="secondary" style={styles.listLabel}>
          {isSearching
            ? t('masoomeen.searchResults', { count: listData.length })
            : t('masoomeen.allEntries', { count: listData.length })}
        </Text>
      </View>
    ),
    [isSearching, listData.length, listFilter, query, setQuery, t, theme],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <FlatList
        style={styles.list}
        data={listData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState title={t('masoomeen.noResults')} subtitle={t('common.emptySubtitle')} />
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
    marginBottom: layout.blockGap,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 40,
    flexGrow: 1,
  },
  row: {
    gap: layout.blockGap,
    marginBottom: layout.blockGap,
  },
  cell: {
    flex: 1,
  },
  emptyCard: {
    marginTop: layout.blockGap,
  },
});

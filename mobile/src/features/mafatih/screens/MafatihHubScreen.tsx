import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MafatihCollectionGrid } from '../components/MafatihCollectionGrid';
import { MafatihEntryRow } from '../components/MafatihEntryRow';
import { MafatihFilterTabs } from '../components/MafatihFilterTabs';
import { MafatihSearchBar } from '../components/MafatihSearchBar';
import { MafatihTodayCard } from '../components/MafatihTodayCard';
import { MafatihRepository } from '../engine/mafatihRepository';
import { useMafatihHub } from '../hooks/useMafatihHub';
import { useMafatihSearch } from '../hooks/useMafatihSearch';
import { useMafatihBookmarkStore } from '../stores/mafatihBookmarkStore';
import { useMafatihFavoriteStore } from '../stores/mafatihFavoriteStore';
import type { MafatihCollectionId, MafatihEntry, MafatihHubFilter, MafatihRef } from '../types';
import { parseMafatihRef } from '../types';
import { isTextOffline } from '../utils/textOffline';

export function MafatihHubScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Mafatih'>>();
  const [filter, setFilter] = useState<MafatihHubFilter>('all');
  const [collectionId, setCollectionId] = useState<MafatihCollectionId | null>(
    route.params?.collectionId ?? null,
  );

  useEffect(() => {
    if (route.params?.collectionId != null) {
      setCollectionId(route.params.collectionId);
    }
  }, [route.params?.collectionId]);

  const { query, setQuery, results, debouncedQuery } = useMafatihSearch();
  const { entries, today, collections } = useMafatihHub(filter, collectionId);

  const isBookmarked = useMafatihBookmarkStore((s) => s.isBookmarked);
  const isFavorite = useMafatihFavoriteStore((s) => s.isFavorite);
  const toggleFavorite = useMafatihFavoriteStore((s) => s.toggleFavorite);

  const showingSearch = debouncedQuery.length >= 2;

  const listData = useMemo((): MafatihEntry[] => {
    if (showingSearch) {
      return results
        .map((r) => MafatihRepository.getEntry(r.ref))
        .filter((e): e is MafatihEntry => e != null);
    }
    return entries;
  }, [showingSearch, results, entries]);

  const headerTitle = useMemo(() => {
    if (collectionId) {
      const collection = collections.find((item) => item.id === collectionId);
      if (collection) {
        const titleLocale = locale === 'ur' ? 'ur' : locale === 'ar' ? 'ar' : 'en';
        return collection.titles[titleLocale];
      }
    }
    return t('mafatih.title');
  }, [collectionId, collections, locale, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: headerTitle,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, headerTitle, theme]);

  const openReader = useCallback(
    (ref: MafatihRef) => {
      const { kind, contentId } = parseMafatihRef(ref);
      if (kind === 'sahifa') {
        navigation.navigate('SahifaReader', { sahifaId: contentId });
        return;
      }
      navigation.navigate('MafatihReader', { ref });
    },
    [navigation],
  );

  const onFilterChange = useCallback((next: MafatihHubFilter) => {
    setFilter(next);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: MafatihEntry; index: number }) => (
      <View
        style={[
          styles.entryRowWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderTopLeftRadius: index === 0 ? theme.radius.lg : 0,
            borderTopRightRadius: index === 0 ? theme.radius.lg : 0,
            borderBottomLeftRadius: index === listData.length - 1 ? theme.radius.lg : 0,
            borderBottomRightRadius: index === listData.length - 1 ? theme.radius.lg : 0,
            borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: index === listData.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <MafatihEntryRow
          entry={item}
          bookmarked={isBookmarked(item.ref)}
          favorited={isFavorite(item.ref)}
          offline={isTextOffline(item.ref)}
          isLast={index === listData.length - 1}
          onPress={() => openReader(item.ref)}
          onToggleFavorite={() => toggleFavorite(item.ref)}
        />
      </View>
    ),
    [isBookmarked, isFavorite, listData.length, openReader, theme, toggleFavorite],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('mafatih.subtitle')}
        </Text>

        <MafatihSearchBar value={query} onChangeText={setQuery} />

        {today && !showingSearch ? (
          <MafatihTodayCard entry={today} onPress={() => openReader(today.ref)} />
        ) : null}

        {!showingSearch ? (
          <View style={styles.filters}>
            <MafatihFilterTabs active={filter} onChange={onFilterChange} />
          </View>
        ) : null}

        {!showingSearch && collections.length > 0 ? (
          <MafatihCollectionGrid
            collections={collections}
            activeId={collectionId}
            onSelect={setCollectionId}
          />
        ) : null}

        {showingSearch ? (
          <Text variant="overline" color="secondary" style={styles.listLabel}>
            {t('mafatih.searchResults', { count: listData.length })}
          </Text>
        ) : (
          <Text variant="overline" color="secondary" style={styles.listLabel}>
            {collectionId
              ? t('mafatih.filteredEntries', { count: listData.length })
              : t('mafatih.allEntries', { count: listData.length })}
          </Text>
        )}
      </View>
    ),
    [
      collectionId,
      collections,
      filter,
      listData.length,
      onFilterChange,
      openReader,
      query,
      setQuery,
      showingSearch,
      t,
      today,
    ],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <FlatList
        style={styles.list}
        data={listData}
        keyExtractor={(item) => item.ref}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState
              title={showingSearch ? t('mafatih.search.noResults') : t('mafatih.empty')}
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
  },
  subtitle: {
    maxWidth: '92%',
  },
  filters: {
    marginTop: layout.sectionGap,
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

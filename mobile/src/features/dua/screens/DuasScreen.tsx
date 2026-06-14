import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import {
  COLLAPSIBLE_TOOLBAR_MAX,
  CollapsibleHubToolbar,
} from '@/components/ui/CollapsibleHubToolbar';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { DuaFeaturedCard } from '../components/DuaFeaturedCard';
import { DuaListRow } from '../components/DuaListRow';
import { DuaSearchBar } from '../components/DuaSearchBar';
import { DUA_CATALOG, DUA_RECITERS } from '../constants/catalog';
import { DuaRepository } from '../engine/duaRepository';
import { useDuaBookmarkStore } from '../stores/duaBookmarkStore';
import { useDuaDownloadStore } from '../stores/duaDownloadStore';
import type { DuaMeta } from '../types';

type Filter = 'all' | 'bookmarked';

const FEATURED_DUA_ID = 'dua_kumail';

function matchesQuery(meta: DuaMeta, query: string): boolean {
  const haystack = [
    meta.titles.en,
    meta.titles.ur,
    meta.titles.ar,
    meta.description.en,
    meta.description.ur,
    meta.recommendedTime.en,
    meta.recommendedTime.ur,
    meta.category,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function DuasScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const bookmarks = useDuaBookmarkStore((s) => s.bookmarks);
  const downloads = useDuaDownloadStore((s) => s.downloads);
  const defaultReciter = DUA_RECITERS[0].id;
  const featured = useMemo(
    () => DUA_CATALOG.find((item) => item.id === FEATURED_DUA_ID),
    [],
  );

  const showingSearch = query.trim().length >= 2;

  const duas = useMemo(() => {
    let list = DuaRepository.listDuas();

    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.duaId));
      list = list.filter((d) => ids.has(d.id));
    }

    if (showingSearch) {
      const normalized = query.trim().toLowerCase();
      list = list.filter((item) => matchesQuery(item, normalized));
    }

    return list;
  }, [filter, bookmarks, query, showingSearch]);

  const offlineIds = useMemo(() => {
    return new Set(
      Object.values(downloads)
        .filter((d) => d.reciterId === defaultReciter)
        .map((d) => d.duaId),
    );
  }, [downloads, defaultReciter]);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.duaId)),
    [bookmarks],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('dua.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const openReader = useCallback(
    (duaId: DuaMeta['id']) => {
      navigation.navigate('DuaReader', { duaId });
    },
    [navigation],
  );

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: DuaMeta; index: number }) => (
      <View
        style={[
          styles.entryRowWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderTopLeftRadius: index === 0 ? theme.radius.lg : 0,
            borderTopRightRadius: index === 0 ? theme.radius.lg : 0,
            borderBottomLeftRadius: index === duas.length - 1 ? theme.radius.lg : 0,
            borderBottomRightRadius: index === duas.length - 1 ? theme.radius.lg : 0,
            borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: index === duas.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <DuaListRow
          meta={item}
          bookmarked={bookmarkedIds.has(item.id)}
          offline={offlineIds.has(item.id)}
          isLast={index === duas.length - 1}
          onPress={() => openReader(item.id)}
        />
      </View>
    ),
    [bookmarkedIds, duas.length, offlineIds, openReader, theme],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('dua.subtitle')}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('dua.stats', { count: DUA_CATALOG.length })}
        </Text>

        {featured && !showingSearch && filter === 'all' ? (
          <DuaFeaturedCard meta={featured} onPress={() => openReader(featured.id)} />
        ) : null}

        <Text variant="overline" color="secondary" style={styles.listLabel}>
          {showingSearch
            ? t('dua.searchResults', { count: duas.length })
            : t('dua.allEntries', { count: duas.length })}
        </Text>
      </View>
    ),
    [duas.length, featured, filter, openReader, showingSearch, t],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <CollapsibleHubToolbar
        scrollY={scrollY}
        search={<DuaSearchBar value={query} onChangeText={setQuery} />}
        filters={
          <SegmentControl
            options={[
              { value: 'all', label: t('dua.filterAll') },
              { value: 'bookmarked', label: t('dua.filterBookmarked') },
            ]}
            value={filter}
            onChange={setFilter}
          />
        }
      />

      <Animated.FlatList
        style={styles.list}
        data={duas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState
              title={showingSearch ? t('dua.noResults') : t('dua.noBookmarks')}
              subtitle={t('common.emptySubtitle')}
            />
          </Card>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: COLLAPSIBLE_TOOLBAR_MAX + layout.listGap },
        ]}
        scrollEventThrottle={16}
        onScroll={onScroll}
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
    paddingBottom: layout.blockGap,
    gap: 4,
  },
  subtitle: {
    maxWidth: '92%',
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

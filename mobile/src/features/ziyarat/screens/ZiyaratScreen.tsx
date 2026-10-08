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

import { ZiyaratFeaturedCard } from '../components/ZiyaratFeaturedCard';
import { ZiyaratListCard } from '../components/ZiyaratListCard';
import { ZiyaratSearchBar } from '../components/ZiyaratSearchBar';
import { OCCASION_LABELS, ZIYARAT_CATALOG, ZIYARAT_RECITERS } from '../constants/catalog';
import { ZiyaratRepository } from '../engine/ziyaratRepository';
import { useZiyaratBookmarkStore } from '../stores/ziyaratBookmarkStore';
import { useZiyaratDownloadStore } from '../stores/ziyaratDownloadStore';
import type { ZiyaratMeta } from '../types';

type Filter = 'all' | 'bookmarked';

const FEATURED_ZIYARAT_ID = 'ziyarat_ashura';

function matchesQuery(meta: ZiyaratMeta, query: string): boolean {
  const occasion = OCCASION_LABELS[meta.occasion];
  const haystack = [
    meta.titles.en,
    meta.titles.ur,
    meta.titles.ar,
    meta.imam.en,
    meta.imam.ur,
    meta.imam.ar,
    meta.description.en,
    meta.description.ur,
    meta.recommendedTime.en,
    meta.recommendedTime.ur,
    meta.source.en,
    meta.source.ur,
    occasion.en,
    occasion.ur,
    occasion.ar,
    meta.occasion,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function ZiyaratScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const bookmarks = useZiyaratBookmarkStore((s) => s.bookmarks);
  const downloads = useZiyaratDownloadStore((s) => s.downloads);
  const defaultReciter = ZIYARAT_RECITERS[0].id;
  const featured = useMemo(
    () => ZIYARAT_CATALOG.find((item) => item.id === FEATURED_ZIYARAT_ID),
    [],
  );

  const showingSearch = query.trim().length >= 2;

  const items = useMemo(() => {
    let list = ZiyaratRepository.list();

    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.ziyaratId));
      list = list.filter((z) => ids.has(z.id));
    }

    if (showingSearch) {
      const normalized = query.trim().toLowerCase();
      list = list.filter((item) => matchesQuery(item, normalized));
    }

    return list;
  }, [filter, bookmarks, query, showingSearch]);

  const offlineIds = useMemo(
    () =>
      new Set(
        Object.values(downloads)
          .filter((d) => d.reciterId === defaultReciter)
          .map((d) => d.ziyaratId),
      ),
    [downloads, defaultReciter],
  );

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.ziyaratId)),
    [bookmarks],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('ziyarat.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const openReader = useCallback(
    (ziyaratId: ZiyaratMeta['id']) => {
      navigation.navigate('ZiyaratReader', { ziyaratId });
    },
    [navigation],
  );

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: ZiyaratMeta; index: number }) => (
      <View
        style={[
          styles.entryRowWrap,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderTopLeftRadius: index === 0 ? theme.radius.lg : 0,
            borderTopRightRadius: index === 0 ? theme.radius.lg : 0,
            borderBottomLeftRadius: index === items.length - 1 ? theme.radius.lg : 0,
            borderBottomRightRadius: index === items.length - 1 ? theme.radius.lg : 0,
            borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
            borderBottomWidth: index === items.length - 1 ? StyleSheet.hairlineWidth : 0,
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderRightWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
        <ZiyaratListCard
          meta={item}
          bookmarked={bookmarkedIds.has(item.id)}
          offline={offlineIds.has(item.id)}
          isLast={index === items.length - 1}
          onPress={() => openReader(item.id)}
        />
      </View>
    ),
    [bookmarkedIds, items.length, offlineIds, openReader, theme],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('ziyarat.subtitle')}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('ziyarat.stats', { count: ZIYARAT_CATALOG.length })}
        </Text>

        {featured && !showingSearch && filter === 'all' ? (
          <ZiyaratFeaturedCard meta={featured} onPress={() => openReader(featured.id)} />
        ) : null}

        <Text variant="overline" color="secondary" style={styles.listLabel}>
          {showingSearch
            ? t('ziyarat.searchResults', { count: items.length })
            : t('ziyarat.allEntries', { count: items.length })}
        </Text>
      </View>
    ),
    [featured, filter, items.length, openReader, showingSearch, t],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <CollapsibleHubToolbar
        scrollY={scrollY}
        search={<ZiyaratSearchBar value={query} onChangeText={setQuery} />}
        filters={
          <SegmentControl
            options={[
              { value: 'all', label: t('ziyarat.filterAll') },
              { value: 'bookmarked', label: t('ziyarat.filterBookmarked') },
            ]}
            value={filter}
            onChange={setFilter}
          />
        }
      />

      <Animated.FlatList
        style={styles.list}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState
              title={showingSearch ? t('ziyarat.noResults') : t('ziyarat.noBookmarks')}
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

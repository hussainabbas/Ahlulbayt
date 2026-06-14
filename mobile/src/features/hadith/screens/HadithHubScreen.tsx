import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

import { HadithFeaturedCard } from '../components/HadithFeaturedCard';
import { HadithFilterTabs } from '../components/HadithFilterTabs';
import { HadithListRow } from '../components/HadithListRow';
import { HadithSearchBar } from '../components/HadithSearchBar';
import { HadithSourceGrid } from '../components/HadithSourceGrid';
import { HadithTopicGrid } from '../components/HadithTopicGrid';
import { HadithTopicTabs } from '../components/HadithTopicTabs';
import { HADITH_COUNT } from '../data/bundled';
import { HadithRepository } from '../engine/hadithRepository';
import { useHadithSearch } from '../hooks/useHadithSearch';
import { useHadithBookmarkStore } from '../stores/hadithBookmarkStore';
import type { HadithEntry, HadithId, HadithSource, HadithTopic } from '../types';

type ListFilter = 'all' | 'bookmarked';

const FEATURED_HADITH_ID = 'hd_nahjul_thaqalayn' as HadithId;

export function HadithHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [source, setSource] = useState<HadithSource | 'all'>('all');
  const [topic, setTopic] = useState<HadithTopic | 'all'>('all');
  const [listFilter, setListFilter] = useState<ListFilter>('all');
  const [showTopics, setShowTopics] = useState(false);

  const { query, setQuery, results, isSearching } = useHadithSearch(source, topic);
  const bookmarks = useHadithBookmarkStore((s) => s.bookmarks);

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.hadithId)),
    [bookmarks],
  );

  const featured = useMemo(() => HadithRepository.getEntry(FEATURED_HADITH_ID), []);
  const topicSummaries = useMemo(
    () => HadithRepository.getTopicSummaries().filter((summary) => summary.count > 0),
    [],
  );

  const sourceCounts = useMemo(() => {
    const all = HadithRepository.listAll();
    return {
      all: all.length,
      nahjul: all.filter((entry) => entry.source === 'nahjul').length,
      kafi: all.filter((entry) => entry.source === 'kafi').length,
      bihar: all.filter((entry) => entry.source === 'bihar').length,
    } satisfies Record<HadithSource | 'all', number>;
  }, []);

  const listData = useMemo((): HadithEntry[] => {
    if (isSearching) {
      return results
        .map((r) => HadithRepository.getEntry(r.id))
        .filter((e): e is HadithEntry => e != null);
    }

    return HadithRepository.filterEntries({
      source,
      topic,
      bookmarkedIds,
      bookmarkOnly: listFilter === 'bookmarked',
    });
  }, [isSearching, results, source, topic, listFilter, bookmarkedIds]);

  const openDetail = useCallback(
    (id: HadithId) => {
      navigation.navigate('HadithDetail', { hadithId: id });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('hadith.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const renderItem = useCallback(
    ({ item, index }: { item: HadithEntry; index: number }) => (
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
        <HadithListRow
          entry={item}
          bookmarked={bookmarkedIds.has(item.id)}
          isLast={index === listData.length - 1}
          onPress={() => openDetail(item.id)}
        />
      </View>
    ),
    [bookmarkedIds, listData.length, openDetail, theme],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="bodySm" color="secondary" style={styles.subtitle}>
          {t('hadith.subtitle')}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('hadith.stats', { count: HADITH_COUNT, sources: 3 })}
        </Text>

        <HadithSearchBar value={query} onChangeText={setQuery} />

        {featured && !isSearching && listFilter === 'all' && source === 'all' && topic === 'all' ? (
          <HadithFeaturedCard entry={featured} onPress={() => openDetail(featured.id)} />
        ) : null}

        {!isSearching ? (
          <>
            <HadithSourceGrid activeId={source} counts={sourceCounts} onSelect={setSource} />

            <View style={styles.section}>
              <Text variant="overline" color="secondary">
                {t('hadith.topicsLabel')}
              </Text>
              <HadithTopicTabs active={topic} onChange={setTopic} />
            </View>

            <View style={styles.section}>
              <HadithFilterTabs
                active={listFilter}
                showTopics={showTopics}
                onChange={setListFilter}
                onToggleTopics={() => setShowTopics((value) => !value)}
              />
            </View>

            {showTopics ? (
              <View style={styles.section}>
                <HadithTopicGrid
                  summaries={topicSummaries}
                  activeTopic={topic}
                  onSelect={(nextTopic) => {
                    setTopic(nextTopic);
                    setShowTopics(false);
                  }}
                />
              </View>
            ) : null}
          </>
        ) : null}

        <Text variant="overline" color="secondary" style={styles.listLabel}>
          {isSearching
            ? t('hadith.searchResults', { count: listData.length })
            : t('hadith.allEntries', { count: listData.length })}
        </Text>
      </View>
    ),
    [
      featured,
      isSearching,
      listData.length,
      listFilter,
      openDetail,
      query,
      setQuery,
      showTopics,
      source,
      sourceCounts,
      t,
      topic,
      topicSummaries,
    ],
  );

  return (
    <Screen padded={false} safeTop={false}>
      <FlatList
        style={styles.list}
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Card padded={false} style={styles.emptyCard} shadow="none">
            <EmptyState title={t('hadith.noResults')} subtitle={t('common.emptySubtitle')} />
          </Card>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
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
  section: {
    marginTop: layout.sectionGap,
    gap: layout.blockGap,
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

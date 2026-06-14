import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { HadithListRow } from '../components/HadithListRow';
import { HadithSourceTabs } from '../components/HadithSourceTabs';
import { HadithTopicSummaryCard } from '../components/HadithTopicSummaryCard';
import { HadithTopicTabs } from '../components/HadithTopicTabs';
import { HadithRepository } from '../engine/hadithRepository';
import { useHadithSearch } from '../hooks/useHadithSearch';
import { useHadithBookmarkStore } from '../stores/hadithBookmarkStore';
import type { HadithEntry, HadithId, HadithSource, HadithTopic } from '../types';

type ListFilter = 'all' | 'bookmarked';

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

  const topicSummaries = useMemo(() => HadithRepository.getTopicSummaries(), []);

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

  const openDetail = (id: HadithId) => {
    navigation.navigate('HadithDetail', { hadithId: id });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('hadith.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="displayMd">{t('hadith.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('hadith.subtitle')}
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('hadith.searchPlaceholder')}
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
            <HadithSourceTabs active={source} onChange={setSource} />
            <HadithTopicTabs active={topic} onChange={setTopic} />

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
                        borderColor: active
                          ? theme.colors.accentPrimary
                          : theme.colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text variant="bodySm" color={active ? 'accent' : 'secondary'}>
                      {t(`hadith.filter.${f}`)}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setShowTopics((v) => !v)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: showTopics
                      ? theme.colors.accentPrimaryMuted
                      : theme.colors.surfaceMuted,
                    borderColor: showTopics
                      ? theme.colors.accentPrimary
                      : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="bodySm" color={showTopics ? 'accent' : 'secondary'}>
                  {t('hadith.topicsOverview')}
                </Text>
              </Pressable>
            </View>

            {showTopics ? (
              <View style={styles.topicGrid}>
                {topicSummaries
                  .filter((ts) => ts.count > 0)
                  .map((ts) => (
                    <HadithTopicSummaryCard
                      key={ts.topic}
                      topicSummary={ts}
                      active={topic === ts.topic}
                      onPress={() => {
                        setTopic(ts.topic);
                        setShowTopics(false);
                      }}
                    />
                  ))}
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: theme.spacing[5] }]}
        ListEmptyComponent={
          <EmptyState
            title={t('hadith.noResults')}
            subtitle={t('common.emptySubtitle')}
          />
        }
        renderItem={({ item }) => (
          <HadithListRow
            entry={item}
            bookmarked={bookmarkedIds.has(item.id)}
            onPress={() => openDetail(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 10, paddingTop: 8, paddingBottom: 12 },
  search: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  topicGrid: { gap: 8, marginTop: 8 },
  list: { paddingBottom: 32 },
  separator: { height: 10 },
  empty: { textAlign: 'center', marginTop: 40 },
});

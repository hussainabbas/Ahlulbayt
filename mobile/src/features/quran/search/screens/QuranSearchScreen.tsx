import { useLayoutEffect, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { SearchResultSkeleton } from '@/components/feedback/skeletonPresets';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import type { RootStackParamList } from '@/navigation/types';

import { SEARCH_EXAMPLE_QUERIES } from '../data/quranTopics';
import { useAiQuranSearch } from '../hooks/useAiQuranSearch';
import { ExampleChip, SearchBar } from '../components/SearchBar';
import { SearchResultRow } from '../components/SearchResultRow';

export function QuranSearchScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'QuranSearch'>>();
  const { query, setQuery, searchNow, results, matchedTopics, isSearching, debouncedQuery } =
    useAiQuranSearch();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('quran.search.title') });
  }, [navigation, t]);

  useEffect(() => {
    const seed = route.params?.query;
    if (seed) searchNow(seed);
  }, [route.params?.query, searchNow]);

  const showEmpty = debouncedQuery.length >= 2 && !isSearching && results.length === 0;
  const showExamples = debouncedQuery.length < 2;
  const showResultsSkeleton = isSearching && debouncedQuery.length >= 2;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="displayMd">{t('quran.search.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('quran.search.subtitle')}
        </Text>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={() => searchNow(query)}
        autoFocus
      />

      {showExamples ? (
        <View style={styles.examples}>
          <Text variant="overline" color="secondary" style={{ marginBottom: theme.spacing[2] }}>
            {t('quran.search.examples')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {SEARCH_EXAMPLE_QUERIES.map((example) => (
              <ExampleChip key={example} label={example} onPress={() => searchNow(example)} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {matchedTopics.length > 0 ? (
        <View style={[styles.topics, { marginTop: theme.spacing[4] }]}>
          <Text variant="overline" color="secondary">
            {t('quran.search.matchedTopics')}
          </Text>
          <View style={styles.chipRow}>
            {matchedTopics.map((topic) => (
              <View
                key={topic.id}
                style={[
                  styles.topicPill,
                  {
                    backgroundColor: theme.colors.accentPrimaryMuted,
                    borderColor: theme.colors.accentPrimary,
                  },
                ]}
              >
                <Text variant="caption" color="accent">
                  {topic.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {showResultsSkeleton ? (
        <View style={{ marginTop: theme.spacing[4] }}>
          <SearchResultSkeleton rows={6} />
        </View>
      ) : null}

      {showEmpty ? (
        <EmptyState
          title={t('quran.search.noResults')}
          subtitle={t('common.emptySubtitle')}
          style={{ marginTop: theme.spacing[4] }}
        />
      ) : null}

      {!showResultsSkeleton ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.ref}
          renderItem={({ item }) => (
            <SearchResultRow
              result={item}
              onPress={(result) => {
                navigation.navigate('QuranReader', {
                  surahNumber: result.surah,
                  ayah: result.ayah,
                });
              }}
            />
          )}
          style={{ marginTop: theme.spacing[4], flex: 1 }}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
    marginBottom: 16,
  },
  examples: {
    marginTop: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  topics: {
    gap: 8,
  },
  topicPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  list: {
    paddingBottom: 120,
  },
});

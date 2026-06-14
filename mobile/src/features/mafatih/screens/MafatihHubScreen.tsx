import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MafatihEntryRow } from '../components/MafatihEntryRow';
import { MafatihFilterTabs } from '../components/MafatihFilterTabs';
import { MafatihSearchBar } from '../components/MafatihSearchBar';
import { MafatihTodayCard } from '../components/MafatihTodayCard';
import { MafatihRepository } from '../engine/mafatihRepository';
import { useMafatihHub } from '../hooks/useMafatihHub';
import { useMafatihSearch } from '../hooks/useMafatihSearch';
import { useMafatihBookmarkStore } from '../stores/mafatihBookmarkStore';
import { useMafatihFavoriteStore } from '../stores/mafatihFavoriteStore';
import { isTextOffline } from '../stores/mafatihOfflineStore';
import type { MafatihEntry, MafatihHubFilter, MafatihRef } from '../types';
import { parseMafatihRef } from '../types';

export function MafatihHubScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<MafatihHubFilter>('all');

  const { query, setQuery, results, debouncedQuery } = useMafatihSearch();
  const { entries, today, collections } = useMafatihHub(filter);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('mafatih.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  const openReader = (ref: MafatihRef) => {
    const { kind, contentId } = parseMafatihRef(ref);
    if (kind === 'sahifa') {
      navigation.navigate('SahifaReader', { sahifaId: contentId });
      return;
    }
    navigation.navigate('MafatihReader', { ref });
  };

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="displayMd">{t('mafatih.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('mafatih.subtitle')}
        </Text>

        <MafatihSearchBar value={query} onChangeText={setQuery} />

        {!showingSearch && today ? (
          <View style={{ marginTop: theme.spacing[4] }}>
            <MafatihTodayCard entry={today} onPress={() => openReader(today.ref)} />
          </View>
        ) : null}

        {!showingSearch ? (
          <View style={{ marginTop: theme.spacing[3] }}>
            <MafatihFilterTabs active={filter} onChange={setFilter} />
          </View>
        ) : null}
      </View>

      {!showingSearch && collections.length > 0 ? (
        <View style={[styles.collections, { paddingHorizontal: theme.spacing[5] }]}>
          <Text variant="overline" color="secondary">
            {t('mafatih.collections')}
          </Text>
          <View style={styles.collectionRow}>
            {collections.map((c) => {
              const label =
                locale === 'ur' ? c.titles.ur : locale === 'ar' ? c.titles.ar : c.titles.en;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setFilter('all')}
                  style={[
                    styles.collectionChip,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.borderSubtle,
                    },
                  ]}
                >
                  <Text variant="caption" color="secondary">
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <Card padded={false} style={styles.listCard}>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.ref}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 12 }}>
              <MafatihEntryRow
                entry={item}
                  bookmarked={isBookmarked(item.ref)}
                  favorited={isFavorite(item.ref)}
                  offline={isTextOffline(item.ref)}
                  onPress={() => openReader(item.ref)}
                  onToggleFavorite={() => toggleFavorite(item.ref)}
              />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              title={showingSearch ? t('mafatih.search.noResults') : t('mafatih.empty')}
              subtitle={t('common.emptySubtitle')}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  collections: {
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  collectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  collectionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
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

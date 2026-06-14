import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MasoomeenGridCard } from '../components/MasoomeenGridCard';
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

  const openProfile = (id: MasoomeenId) => {
    navigation.navigate('MasoomeenProfile', { masoomeenId: id });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('masoomeen.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="displayMd">{t('masoomeen.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('masoomeen.subtitle')}
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('masoomeen.searchPlaceholder')}
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
                    {t(`masoomeen.filter.${f}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: theme.spacing[5] },
        ]}
        ListEmptyComponent={
          <Text variant="bodyMd" color="secondary" style={styles.empty}>
            {t('masoomeen.noResults')}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <MasoomeenGridCard
              meta={item}
              bookmarked={bookmarkedIds.has(item.id)}
              onPress={() => openProfile(item.id)}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  search: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  list: {
    paddingBottom: 32,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  cell: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
  },
});

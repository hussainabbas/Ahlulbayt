import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { SahifaListRow } from '../components/SahifaListRow';
import { SAHIFA_RECITERS } from '../constants/catalog';
import { SahifaRepository } from '../engine/sahifaRepository';
import { useSahifaBookmarkStore } from '../stores/sahifaBookmarkStore';
import { useSahifaDownloadStore } from '../stores/sahifaDownloadStore';

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

  const supplications = useMemo(() => {
    let list = query.trim()
      ? SahifaRepository.search(query)
      : SahifaRepository.listAll();

    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.sahifaId));
      list = list.filter((s) => ids.has(s.id));
    }

    return list;
  }, [filter, bookmarks, query]);

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
      title: t('sahifa.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="displayMd">{t('sahifa.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('sahifa.subtitle')}
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('sahifa.searchPlaceholder')}
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

        <View style={styles.filters}>
          {(['all', 'bookmarked'] as const).map((f) => {
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? theme.colors.accentPrimaryMuted
                      : theme.colors.surfaceMuted,
                    borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="caption" color={active ? 'accent' : 'secondary'}>
                  {t(f === 'all' ? 'sahifa.filterAll' : 'sahifa.filterBookmarked')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Card padded={false} style={styles.listCard}>
        <FlatList
          data={supplications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SahifaListRow
              meta={item}
              bookmarked={bookmarkedIds.has(item.id)}
              offline={offlineIds.has(item.id)}
              onPress={() => navigation.navigate('SahifaReader', { sahifaId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Text variant="bodyMd" color="secondary" style={styles.empty}>
              {query.trim() ? t('sahifa.noResults') : t('sahifa.noBookmarks')}
            </Text>
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
    paddingBottom: 12,
    gap: 8,
  },
  search: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
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

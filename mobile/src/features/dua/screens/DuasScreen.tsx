import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { DuaListRow } from '../components/DuaListRow';
import { DuaRepository } from '../engine/duaRepository';
import { useDuaBookmarkStore } from '../stores/duaBookmarkStore';
import { useDuaDownloadStore } from '../stores/duaDownloadStore';
import { DUA_RECITERS } from '../constants/catalog';

type Filter = 'all' | 'bookmarked';

export function DuasScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('all');

  const bookmarks = useDuaBookmarkStore((s) => s.bookmarks);
  const downloads = useDuaDownloadStore((s) => s.downloads);
  const defaultReciter = DUA_RECITERS[0].id;

  const duas = useMemo(() => {
    const all = DuaRepository.listDuas();
    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.duaId));
      return all.filter((d) => ids.has(d.id));
    }
    return all;
  }, [filter, bookmarks]);

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
      title: t('dua.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <ScreenHeader title={t('dua.title')} subtitle={t('dua.subtitle')} />
        <SegmentControl
          options={[
            { value: 'all', label: t('dua.filterAll') },
            { value: 'bookmarked', label: t('dua.filterBookmarked') },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>

      <Card padded={false} style={styles.listCard} shadow="none">
        <FlatList
          data={duas}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <DuaListRow
              meta={item}
              bookmarked={bookmarkedIds.has(item.id)}
              offline={offlineIds.has(item.id)}
              isLast={index === duas.length - 1}
              onPress={() => navigation.navigate('DuaReader', { duaId: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState title={t('dua.noBookmarks')} subtitle={t('common.emptySubtitle')} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.screenPaddingY,
    paddingBottom: layout.blockGap,
  },
  listCard: {
    flex: 1,
    marginHorizontal: layout.screenPaddingX,
    marginBottom: layout.listGap,
  },
  listContent: {
    paddingBottom: 40,
  },
});

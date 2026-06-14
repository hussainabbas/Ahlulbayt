import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { ZiyaratListCard } from '../components/ZiyaratListCard';
import { ZiyaratRepository } from '../engine/ziyaratRepository';
import { ZIYARAT_RECITERS } from '../constants/catalog';
import { useZiyaratBookmarkStore } from '../stores/ziyaratBookmarkStore';
import { useZiyaratDownloadStore } from '../stores/ziyaratDownloadStore';

type Filter = 'all' | 'bookmarked';

export function ZiyaratScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('all');

  const bookmarks = useZiyaratBookmarkStore((s) => s.bookmarks);
  const downloads = useZiyaratDownloadStore((s) => s.downloads);
  const defaultReciter = ZIYARAT_RECITERS[0].id;

  const items = useMemo(() => {
    const all = ZiyaratRepository.list();
    if (filter === 'bookmarked') {
      const ids = new Set(bookmarks.filter((b) => !b.sectionId).map((b) => b.ziyaratId));
      return all.filter((z) => ids.has(z.id));
    }
    return all;
  }, [filter, bookmarks]);

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
      title: t('ziyarat.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <ScreenHeader title={t('ziyarat.title')} subtitle={t('ziyarat.subtitle')} />
        <SegmentControl
          options={[
            { value: 'all', label: t('ziyarat.filterAll') },
            { value: 'bookmarked', label: t('ziyarat.filterBookmarked') },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </View>

      <Card padded={false} style={styles.listCard} shadow="none">
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ZiyaratListCard
              meta={item}
              bookmarked={bookmarkedIds.has(item.id)}
              offline={offlineIds.has(item.id)}
              isLast={index === items.length - 1}
              onPress={() => navigation.navigate('ZiyaratReader', { ziyaratId: item.id })}
            />
          )}
          ListEmptyComponent={
            <EmptyState title={t('ziyarat.noBookmarks')} subtitle={t('common.emptySubtitle')} />
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

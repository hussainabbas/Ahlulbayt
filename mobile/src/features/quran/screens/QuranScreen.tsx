import { useCallback, useEffect, useMemo } from 'react';
import { FlatList, InteractionManager, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { SurahAudioRow } from '../audio/components/SurahAudioRow';
import { useQuranPlayer } from '../audio/hooks/useQuranPlayer';
import { useQuranDownloadStore } from '../audio/stores/quranDownloadStore';
import { RECITERS, SURAH_METADATA } from '../constants/surahMetadata';
import type { SurahMeta } from '../types';

export function QuranScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const { reciterId, changeReciter, addToQueue } = useQuranPlayer();
  const hydrateDownloads = useQuranDownloadStore((s) => s.hydrateDownloads);
  const downloads = useQuranDownloadStore((s) => s.downloads);

  const offlineCount = useMemo(
    () => Object.values(downloads).filter((d) => d.reciterId === reciterId).length,
    [downloads, reciterId],
  );

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      void hydrateDownloads(reciterId);
    });
    return () => task.cancel();
  }, [hydrateDownloads, reciterId]);

  const onOpenSurah = useCallback(
    (surah: number) => {
      rootNavigation.navigate('QuranReader', { surahNumber: surah });
    },
    [rootNavigation],
  );
  const onQueue = useCallback((surah: number) => void addToQueue(surah), [addToQueue]);

  const renderItem = useCallback(
    ({ item }: { item: SurahMeta }) => (
      <SurahAudioRow meta={item} reciterId={reciterId} onPlay={onOpenSurah} onQueue={onQueue} />
    ),
    [reciterId, onOpenSurah, onQueue],
  );

  const keyExtractor = useCallback((item: SurahMeta) => String(item.number), []);

  const reciterOptions = useMemo(
    () =>
      RECITERS.map((reciter) => ({
        value: reciter.id,
        label: t(reciter.nameKey),
      })),
    [t],
  );

  return (
    <Screen padded={false} safeBottom={false}>
      <View style={styles.header}>
        <ScreenHeader
          title={t('quran.title')}
          subtitle={t('quran.player.offlineCount', { count: offlineCount })}
          style={styles.screenHeader}
        />

        <Pressable
          onPress={() => rootNavigation.navigate('QuranSearch')}
          style={[
            styles.searchBtn,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Icon name="search" size={16} color={theme.colors.accentPrimary} />
          <Text variant="bodySm" color="secondary">
            {t('quran.search.openSearch')}
          </Text>
        </Pressable>

        <SegmentControl
          options={reciterOptions}
          value={reciterId}
          onChange={(id) => void changeReciter(id)}
        />
      </View>

      <FlatList
        data={SURAH_METADATA}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={16}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.blockGap,
  },
  screenHeader: {
    marginBottom: layout.blockGap,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.listGap,
    paddingHorizontal: layout.blockGap + 2,
    paddingVertical: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
});

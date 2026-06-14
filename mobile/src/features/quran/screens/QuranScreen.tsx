import { useCallback, useEffect, useMemo } from 'react';
import { Alert, FlatList, InteractionManager, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';

import { SurahAudioRow } from '../audio/components/SurahAudioRow';
import { NATIVE_AUDIO_ENABLED } from '../audio/config';
import { useQuranPlayer } from '../audio/hooks/useQuranPlayer';
import { useQuranDownloadStore } from '../audio/stores/quranDownloadStore';
import { QuranHubHeader } from '../components/QuranHubHeader';
import { RECITERS, SURAH_METADATA } from '../constants/surahMetadata';
import {
  selectOfflineTextCount,
  useQuranTextDownloadStore,
} from '../stores/quranTextDownloadStore';
import type { SurahMeta } from '../types';

export function QuranScreen() {
  const { t } = useLocale();
  const rootNavigation = useRootNavigation();
  const { reciterId, changeReciter, addToQueue, playSurah } = useQuranPlayer();
  const hydrateDownloads = useQuranDownloadStore((s) => s.hydrateDownloads);
  const hydrateTextOffline = useQuranTextDownloadStore((s) => s.hydrateOfflineCatalog);
  const offlineSurahs = useQuranTextDownloadStore((s) => s.offlineSurahs);
  const offlineTextCount = useQuranTextDownloadStore(selectOfflineTextCount);

  useFocusEffect(
    useCallback(() => {
      void hydrateTextOffline();
    }, [hydrateTextOffline]),
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

  const onPlayAudio = useCallback(
    (surah: number) => {
      if (!NATIVE_AUDIO_ENABLED) {
        Alert.alert(t('quran.audio.disabledTitle'), t('quran.audio.disabledMessage'));
        return;
      }
      void playSurah(surah);
    },
    [playSurah, t],
  );

  const onQueue = useCallback((surah: number) => void addToQueue(surah), [addToQueue]);

  const renderItem = useCallback(
    ({ item }: { item: SurahMeta }) => (
      <SurahAudioRow
        meta={item}
        reciterId={reciterId}
        onOpenReader={onOpenSurah}
        onPlayAudio={onPlayAudio}
        onQueue={onQueue}
      />
    ),
    [reciterId, onOpenSurah, onPlayAudio, onQueue],
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

  const listHeader = useMemo(
    () => (
      <QuranHubHeader
        offlineCount={offlineTextCount}
        reciterOptions={reciterOptions}
        reciterId={reciterId}
        onReciterChange={(id) => void changeReciter(id)}
        onSearchPress={() => rootNavigation.navigate('QuranSearch')}
      />
    ),
    [offlineTextCount, reciterOptions, reciterId, changeReciter, rootNavigation],
  );

  return (
    <Screen padded={false} safeBottom={false}>
      <FlatList
        data={SURAH_METADATA}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        extraData={offlineSurahs}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },
  separator: {
    height: 8,
  },
});

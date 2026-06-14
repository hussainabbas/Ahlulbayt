import { useCallback, useEffect, useMemo } from 'react';
import { FlatList, InteractionManager, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FLAT_LIST_PERFORMANCE, surahRowLayout } from '@/core/ui/listPerformance';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { RECITERS, SURAH_METADATA } from '../constants/surahMetadata';
import { SurahAudioRow } from '../audio/components/SurahAudioRow';
import { useQuranPlayer } from '../audio/hooks/useQuranPlayer';
import { useQuranDownloadStore } from '../audio/stores/quranDownloadStore';
import type { SurahMeta } from '../types';

export function QuranScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { reciterId, changeReciter, playSurah, addToQueue } = useQuranPlayer();
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

  const onPlay = useCallback((surah: number) => void playSurah(surah), [playSurah]);
  const onQueue = useCallback((surah: number) => void addToQueue(surah), [addToQueue]);

  const renderItem = useCallback(
    ({ item }: { item: SurahMeta }) => (
      <SurahAudioRow meta={item} reciterId={reciterId} onPlay={onPlay} onQueue={onQueue} />
    ),
    [reciterId, onPlay, onQueue],
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

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <ScreenHeader
          title={t('quran.title')}
          subtitle={t('quran.player.offlineCount', { count: offlineCount })}
          style={styles.screenHeader}
        />

        <Pressable
          onPress={() => navigation.navigate('QuranSearch')}
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
          onChange={(id) => void changeReciter(id).then(() => hydrateDownloads(id))}
        />
      </View>
    ),
    [
      theme,
      t,
      offlineCount,
      navigation,
      reciterId,
      changeReciter,
      hydrateDownloads,
      reciterOptions,
    ],
  );

  return (
    <Screen padded={false}>
      <Card padded={false} style={styles.listCard} shadow="none">
        <FlatList
          data={SURAH_METADATA}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={header}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          getItemLayout={surahRowLayout}
          {...FLAT_LIST_PERFORMANCE}
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
  listCard: {
    flex: 1,
    marginHorizontal: layout.screenPaddingX,
    marginBottom: layout.listGap,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
});

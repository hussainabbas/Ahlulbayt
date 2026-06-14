import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ViewToken } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { DuaAudioBar } from '@/features/dua/components/DuaAudioBar';
import { SahifaAudioBar } from '@/features/sahifa/components/SahifaAudioBar';
import { ZiyaratAudioBar } from '@/features/ziyarat/components/ZiyaratAudioBar';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MafatihSectionBlock } from '../components/MafatihSectionBlock';
import { useMafatihReader } from '../hooks/useMafatihReader';
import { useMafatihBookmarkStore } from '../stores/mafatihBookmarkStore';
import { useMafatihFavoriteStore } from '../stores/mafatihFavoriteStore';
import type { MafatihRef } from '../types';
import { parseMafatihRef } from '../types';

export function MafatihReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MafatihReader'>>();
  const ref = route.params.ref as MafatihRef;

  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    entry,
    sections,
    displayMode,
    translationLayer,
    fontScale,
    focusMode,
    lastRead,
    audio,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
    toggleFocusMode,
    setLastRead,
  } = useMafatihReader(ref);

  const isBookmarked = useMafatihBookmarkStore((s) => s.isBookmarked(ref));
  const toggleBookmark = useMafatihBookmarkStore((s) => s.toggleBookmark);
  const isFavorite = useMafatihFavoriteStore((s) => s.isFavorite(ref));
  const toggleFavorite = useMafatihFavoriteStore((s) => s.toggleFavorite);

  const { kind } = parseMafatihRef(ref);

  useLayoutEffect(() => {
    if (!entry) return;
    const title =
      locale === 'ur' ? entry.titles.ur : locale === 'ar' ? entry.titles.ar : entry.titles.en;
    navigation.setOptions({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable onPress={() => toggleFavorite(ref)} hitSlop={8}>
            <Text variant="bodyMd" color={isFavorite ? 'accent' : 'tertiary'}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
          <Pressable onPress={() => toggleBookmark(ref, entry.titles.en)} hitSlop={8}>
            <Text variant="bodyMd" color={isBookmarked ? 'accent' : 'tertiary'}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>
      ),
    });
  }, [entry, locale, navigation, theme, isBookmarked, isFavorite, ref, toggleBookmark, toggleFavorite]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((v) => v.index != null && v.isViewable);
      if (first?.index != null) {
        setActiveIndex(first.index);
        setLastRead(ref, first.index);
      }
    },
    [ref, setLastRead],
  );

  if (!entry) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('mafatih.notFound')}
        </Text>
      </Screen>
    );
  }

  const progress = sections.length > 0 ? (activeIndex + 1) / sections.length : 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.round(progress * 100)}%`, backgroundColor: theme.colors.accentGold },
          ]}
        />
      </View>

      <FlatList
        ref={listRef}
        data={sections}
        keyExtractor={(item) => item.id}
        initialScrollIndex={lastRead?.sectionIndex ?? 0}
        onScrollToIndexFailed={() => undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 40 }}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing[5],
          paddingBottom: 100,
          paddingTop: 8,
        }}
        ListHeaderComponent={
          !focusMode ? (
            <View style={styles.toolbar}>
              <Text variant="caption" color="tertiary">
                § {entry.mafatihRef} · {entry.source.en}
              </Text>
              <View style={styles.toolRow}>
                <ToolChip label={displayMode === 'stacked' ? t('mafatih.reader.both') : displayMode === 'arabic_only' ? 'AR' : 'TR'} onPress={cycleDisplayMode} />
                <ToolChip label={translationLayer === 'en' ? 'EN' : 'UR'} onPress={cycleTranslation} />
                <ToolChip label={focusMode ? '◉' : '○'} onPress={toggleFocusMode} />
                <ToolChip label="A−" onPress={() => setFontScale(fontScale - 0.08)} />
                <ToolChip label="A+" onPress={() => setFontScale(fontScale + 0.08)} />
              </View>
            </View>
          ) : (
            <Pressable onPress={toggleFocusMode} style={styles.focusExit}>
              <Text variant="caption" color="secondary">
                {t('mafatih.reader.exitFocus')}
              </Text>
            </Pressable>
          )
        }
        renderItem={({ item, index }) => (
          <MafatihSectionBlock
            section={item}
            index={index}
            total={sections.length}
            displayMode={displayMode}
            translationLayer={translationLayer}
            fontScale={fontScale}
            focusMode={focusMode}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {audio && entry.hasAudio ? (
        kind === 'dua' ? (
          <DuaAudioBar
            isPlaying={audio.isPlaying}
            isDownloaded={audio.isDownloaded}
            isDownloading={audio.isDownloading}
            downloadProgress={audio.downloadProgress}
            onTogglePlay={() => void audio.togglePlay()}
            onDownload={() => void audio.download()}
            onRemoveOffline={() => void audio.removeOffline()}
          />
        ) : kind === 'sahifa' ? (
          <SahifaAudioBar
            isPlaying={audio.isPlaying}
            isDownloaded={audio.isDownloaded}
            isDownloading={audio.isDownloading}
            downloadProgress={audio.downloadProgress}
            onTogglePlay={() => void audio.togglePlay()}
            onDownload={() => void audio.download()}
            onRemoveOffline={() => void audio.removeOffline()}
          />
        ) : (
          <ZiyaratAudioBar
            isPlaying={audio.isPlaying}
            isDownloaded={audio.isDownloaded}
            isDownloading={audio.isDownloading}
            downloadProgress={audio.downloadProgress}
            onTogglePlay={() => void audio.togglePlay()}
            onDownload={() => void audio.download()}
            onRemoveOffline={() => void audio.removeOffline()}
          />
        )
      ) : null}
    </View>
  );
}

function ToolChip({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.borderSubtle }]}
    >
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  progressTrack: { height: 2 },
  progressFill: { height: '100%' },
  toolbar: { gap: 10, marginBottom: 12 },
  toolRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  focusExit: { paddingVertical: 8, alignItems: 'center' },
  headerActions: { flexDirection: 'row', gap: 16, marginRight: 8 },
});

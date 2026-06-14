import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ViewToken } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { ZiyaratAudioBar } from '../components/ZiyaratAudioBar';
import { ZiyaratHeroHeader } from '../components/ZiyaratHeroHeader';
import { ZiyaratReaderToolbar } from '../components/ZiyaratReaderToolbar';
import { ZiyaratSectionBlock } from '../components/ZiyaratSectionBlock';
import { ZiyaratSectionNav } from '../components/ZiyaratSectionNav';
import { useZiyaratAudio } from '../hooks/useZiyaratAudio';
import { useZiyaratReader } from '../hooks/useZiyaratReader';
import { useZiyaratBookmarkStore } from '../stores/ziyaratBookmarkStore';
import type { ZiyaratId } from '../types';

export function ZiyaratReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ZiyaratReader'>>();
  const ziyaratId = route.params.ziyaratId as ZiyaratId;

  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    meta,
    sections,
    displayMode,
    translationLayer,
    fontScale,
    focusMode,
    lastRead,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
    toggleFocusMode,
    setLastRead,
  } = useZiyaratReader(ziyaratId);

  const isBookmarked = useZiyaratBookmarkStore((s) => s.isBookmarked(ziyaratId));
  const toggleBookmark = useZiyaratBookmarkStore((s) => s.toggleBookmark);
  const audio = useZiyaratAudio(ziyaratId);

  useLayoutEffect(() => {
    if (!meta) return;
    const title =
      locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
    navigation.setOptions({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [meta, locale, navigation, theme]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((v) => v.index != null && v.isViewable);
      if (first?.index != null) {
        setActiveIndex(first.index);
        setLastRead(ziyaratId, first.index);
      }
    },
    [ziyaratId, setLastRead],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 40 }).current;

  const scrollToSection = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
    setActiveIndex(index);
  };

  if (!meta) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('ziyarat.notFound')}
        </Text>
      </Screen>
    );
  }

  const progress = sections.length > 0 ? (activeIndex + 1) / sections.length : 0;

  const displayLabel =
    displayMode === 'stacked'
      ? t('ziyarat.reader.modeStacked')
      : displayMode === 'arabic_only'
        ? t('ziyarat.reader.modeArabic')
        : t('ziyarat.reader.modeTranslation');

  const translationLabel = translationLayer === 'en' ? 'EN' : 'UR';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <FlatList
        ref={listRef}
        data={sections}
        keyExtractor={(item) => item.id}
        initialScrollIndex={lastRead?.sectionIndex ?? 0}
        onScrollToIndexFailed={() => undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.spacing[5],
            paddingBottom: 100,
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <ZiyaratHeroHeader meta={meta} progress={progress} />

            <ZiyaratSectionNav
              sections={sections}
              activeIndex={activeIndex}
              onSelect={scrollToSection}
            />

            {!focusMode ? (
              <ZiyaratReaderToolbar
                bookmarked={isBookmarked}
                focusMode={focusMode}
                onToggleBookmark={() => toggleBookmark(ziyaratId, meta.titles.en)}
                onToggleDisplay={cycleDisplayMode}
                onToggleTranslation={cycleTranslation}
                onToggleFocus={toggleFocusMode}
                onIncreaseFont={() => setFontScale(fontScale + 0.08)}
                onDecreaseFont={() => setFontScale(fontScale - 0.08)}
                displayLabel={displayLabel}
                translationLabel={translationLabel}
              />
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <ZiyaratSectionBlock
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

      {focusMode ? (
        <PressableFocusExit onPress={toggleFocusMode} label={t('ziyarat.reader.exitFocus')} />
      ) : null}

      {meta.hasAudio ? (
        <ZiyaratAudioBar
          isPlaying={audio.isPlaying}
          isDownloaded={audio.isDownloaded}
          isDownloading={audio.isDownloading}
          downloadProgress={audio.downloadProgress}
          onTogglePlay={() => void audio.togglePlay()}
          onDownload={() => void audio.download()}
          onRemoveOffline={() => void audio.removeOffline()}
        />
      ) : null}
    </View>
  );
}

function PressableFocusExit({ onPress, label }: { onPress: () => void; label: string }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.focusBar, { backgroundColor: theme.colors.surfaceElevated }]}
    >
      <Text variant="caption" color="secondary">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
  },
  header: {
    marginBottom: 4,
  },
  focusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
  },
});

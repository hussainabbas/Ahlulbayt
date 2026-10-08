import { useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { NahjulAudioBar } from '../components/NahjulAudioBar';
import { NahjulReaderToolbar } from '../components/NahjulReaderToolbar';
import { NahjulSectionBlock } from '../components/NahjulSectionBlock';
import { NATIVE_AUDIO_ENABLED } from '@/features/quran/audio/config';
import { useNahjulAudio } from '../hooks/useNahjulAudio';
import { useNahjulReader } from '../hooks/useNahjulReader';
import { useNahjulBookmarkStore } from '../stores/nahjulBookmarkStore';
import type { NahjulId } from '../types';
import { pickNahjulMetaText, pickNahjulTranslation } from '../utils/pickNahjulTranslation';

export function NahjulReaderScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NahjulReader'>>();
  const nahjulId = route.params.nahjulId as NahjulId;

  const {
    meta,
    sections,
    bundle,
    displayMode,
    translationLayer,
    fontScale,
    cycleDisplayMode,
    setTranslationLayer,
    setFontScale,
  } = useNahjulReader(nahjulId);

  const isBookmarked = useNahjulBookmarkStore((s) => s.isBookmarked(nahjulId));
  const toggleBookmark = useNahjulBookmarkStore((s) => s.toggleBookmark);
  const audio = useNahjulAudio(nahjulId);

  const isQuote = meta?.category === 'saying';

  const showTranslationUnavailable = useMemo(() => {
    if (translationLayer === 'en') return false;
    return sections.some((section) => {
      const pick = pickNahjulTranslation(section, translationLayer);
      return pick.isFallback;
    });
  }, [sections, translationLayer]);

  useLayoutEffect(() => {
    if (!meta) return;
    const title = pickNahjulMetaText(meta, 'titles', translationLayer);
    navigation.setOptions({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [meta, translationLayer, navigation, theme]);

  if (!meta) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('nahjul.notFound')}
        </Text>
      </Screen>
    );
  }

  const subtitle = pickNahjulMetaText(meta, 'subtitles', translationLayer);
  const categoryLabel =
    meta.category === 'sermon'
      ? t('nahjul.categories.sermons')
      : meta.category === 'letter'
        ? t('nahjul.categories.letters')
        : t('nahjul.categories.quotes');

  const source = bundle?.source;
  const sourceLabel = source
    ? `${source.url.replace(/^https?:\/\/(www\.)?/, '')} · ${source.edition}`
    : t('nahjul.source');

  const displayLabel =
    displayMode === 'stacked'
      ? t('nahjul.reader.modeStacked')
      : displayMode === 'arabic_only'
        ? t('nahjul.reader.modeArabic')
        : t('nahjul.reader.modeTranslation');

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing[5], paddingBottom: 100 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="caption" color="accent">
              {categoryLabel} · #{meta.number}
            </Text>
            <Text variant="bodySm" color="secondary">
              {subtitle}
            </Text>
            <Text variant="caption" color="tertiary">
              {meta.estimatedMinutes} min
            </Text>
            {showTranslationUnavailable ? (
              <Text variant="caption" color="tertiary" style={styles.unavailableBanner}>
                {t('nahjul.reader.translationUnavailable')}
              </Text>
            ) : null}
            <NahjulReaderToolbar
              bookmarked={isBookmarked}
              translationLayer={translationLayer}
              onToggleBookmark={() => toggleBookmark(nahjulId, meta.titles.en)}
              onToggleDisplay={cycleDisplayMode}
              onTranslationLayerChange={setTranslationLayer}
              onIncreaseFont={() => setFontScale(fontScale + 0.1)}
              onDecreaseFont={() => setFontScale(fontScale - 0.1)}
              displayLabel={displayLabel}
            />
          </View>
        }
        renderItem={({ item }) => (
          <NahjulSectionBlock
            section={item}
            displayMode={displayMode}
            translationLayer={translationLayer}
            fontScale={fontScale}
            isQuote={isQuote}
          />
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text variant="caption" color="tertiary" style={styles.footerText}>
              {t('nahjul.sourceAttribution')}
            </Text>
            <Text variant="caption" color="tertiary" style={styles.footerText}>
              {sourceLabel}
            </Text>
            {source?.attribution ? (
              <Text variant="caption" color="tertiary" style={styles.footerText}>
                {source.attribution}
              </Text>
            ) : null}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {meta.hasAudio && NATIVE_AUDIO_ENABLED ? (
        <NahjulAudioBar
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 8 },
  header: { gap: 8, marginBottom: 8 },
  unavailableBanner: {
    fontStyle: 'italic',
  },
  footer: {
    gap: 4,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.25)',
  },
  footerText: {
    textAlign: 'center',
  },
});

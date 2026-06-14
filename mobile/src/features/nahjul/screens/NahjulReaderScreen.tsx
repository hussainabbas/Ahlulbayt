import { useLayoutEffect } from 'react';
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

export function NahjulReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NahjulReader'>>();
  const nahjulId = route.params.nahjulId as NahjulId;

  const {
    meta,
    sections,
    displayMode,
    translationLayer,
    fontScale,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
  } = useNahjulReader(nahjulId);

  const isBookmarked = useNahjulBookmarkStore((s) => s.isBookmarked(nahjulId));
  const toggleBookmark = useNahjulBookmarkStore((s) => s.toggleBookmark);
  const audio = useNahjulAudio(nahjulId);

  const isQuote = meta?.category === 'saying';

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

  if (!meta) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('nahjul.notFound')}
        </Text>
      </Screen>
    );
  }

  const subtitle = locale === 'ur' ? meta.subtitles.ur : meta.subtitles.en;
  const categoryLabel =
    meta.category === 'sermon'
      ? t('nahjul.categories.sermons')
      : meta.category === 'letter'
        ? t('nahjul.categories.letters')
        : t('nahjul.categories.quotes');

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
              {t('nahjul.source')} · {meta.estimatedMinutes} min
            </Text>
            <NahjulReaderToolbar
              bookmarked={isBookmarked}
              onToggleBookmark={() => toggleBookmark(nahjulId, meta.titles.en)}
              onToggleDisplay={cycleDisplayMode}
              onToggleTranslation={cycleTranslation}
              onIncreaseFont={() => setFontScale(fontScale + 0.1)}
              onDecreaseFont={() => setFontScale(fontScale - 0.1)}
              displayLabel={displayLabel}
              translationLabel={translationLayer === 'en' ? 'EN' : 'UR'}
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
});

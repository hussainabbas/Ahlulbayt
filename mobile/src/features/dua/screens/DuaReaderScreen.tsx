import { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { CitationList } from '@/components/citations';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { mergeCitations, citationsFromReferences } from '@/core/citations';
import { duaSourceToReference } from '@/core/references';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';
import { DuaAudioBar } from '../components/DuaAudioBar';
import { DuaReaderToolbar } from '../components/DuaReaderToolbar';
import { DuaSectionBlock } from '../components/DuaSectionBlock';
import { useDuaAudio } from '../hooks/useDuaAudio';
import { useDuaReader } from '../hooks/useDuaReader';
import { useDuaBookmarkStore } from '../stores/duaBookmarkStore';
import type { DuaId } from '../types';

export function DuaReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DuaReader'>>();
  const duaId = route.params.duaId as DuaId;

  const {
    meta,
    sections,
    displayMode,
    translationLayer,
    fontScale,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
  } = useDuaReader(duaId);

  const isBookmarked = useDuaBookmarkStore((s) => s.isBookmarked(duaId));
  const toggleBookmark = useDuaBookmarkStore((s) => s.toggleBookmark);

  const audio = useDuaAudio(duaId);

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
          {t('dua.notFound')}
        </Text>
      </Screen>
    );
  }

  const subtitle =
    locale === 'ur' ? meta.subtitles.ur : meta.subtitles.en;
  const time =
    locale === 'ur'
      ? meta.recommendedTime.ur
      : locale === 'ar'
        ? meta.recommendedTime.ar
        : meta.recommendedTime.en;

  const displayLabel =
    displayMode === 'stacked'
      ? t('dua.reader.modeStacked')
      : displayMode === 'arabic_only'
        ? t('dua.reader.modeArabic')
        : t('dua.reader.modeTranslation');

  const translationLabel = translationLayer === 'en' ? 'EN' : 'UR';

  const duaCitations = mergeCitations(
    meta.citations,
    citationsFromReferences(
      [duaSourceToReference(duaId, meta.source, meta.titles.en)],
      locale,
    ),
  );

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
            <Text variant="bodySm" color="secondary">
              {subtitle}
            </Text>
            <Text variant="caption" color="tertiary">
              {time}
            </Text>
            <CitationList citations={duaCitations} compact />

            <DuaReaderToolbar
              bookmarked={isBookmarked}
              onToggleBookmark={() =>
                toggleBookmark(duaId, meta.titles.en)
              }
              onToggleDisplay={cycleDisplayMode}
              onToggleTranslation={cycleTranslation}
              onIncreaseFont={() => setFontScale(fontScale + 0.1)}
              onDecreaseFont={() => setFontScale(fontScale - 0.1)}
              displayLabel={displayLabel}
              translationLabel={translationLabel}
            />
          </View>
        }
        renderItem={({ item }) => (
          <DuaSectionBlock
            section={item}
            displayMode={displayMode}
            translationLayer={translationLayer}
            fontScale={fontScale}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {meta.hasAudio ? (
        <DuaAudioBar
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
  root: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
});

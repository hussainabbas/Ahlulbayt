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

import { SahifaAudioBar } from '../components/SahifaAudioBar';
import { SahifaReaderToolbar } from '../components/SahifaReaderToolbar';
import { SahifaSectionBlock } from '../components/SahifaSectionBlock';
import { useSahifaAudio } from '../hooks/useSahifaAudio';
import { useSahifaReader } from '../hooks/useSahifaReader';
import { useSahifaBookmarkStore } from '../stores/sahifaBookmarkStore';
import type { SahifaId } from '../types';

export function SahifaReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SahifaReader'>>();
  const sahifaId = route.params.sahifaId as SahifaId;

  const {
    meta,
    sections,
    displayMode,
    translationLayer,
    fontScale,
    cycleDisplayMode,
    cycleTranslation,
    setFontScale,
  } = useSahifaReader(sahifaId);

  const isBookmarked = useSahifaBookmarkStore((s) => s.isBookmarked(sahifaId));
  const toggleBookmark = useSahifaBookmarkStore((s) => s.toggleBookmark);

  const audio = useSahifaAudio(sahifaId);

  useLayoutEffect(() => {
    if (!meta) return;
    const title =
      locale === 'ur' ? meta.titles.ur : locale === 'ar' ? meta.titles.ar : meta.titles.en;
    navigation.setOptions({
      headerShown: true,
      title: `#${meta.number} · ${title}`,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [meta, locale, navigation, theme]);

  if (!meta) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('sahifa.notFound')}
        </Text>
      </Screen>
    );
  }

  const subtitle =
    locale === 'ur' ? meta.subtitles.ur : meta.subtitles.en;

  const displayLabel =
    displayMode === 'stacked'
      ? t('sahifa.reader.modeStacked')
      : displayMode === 'arabic_only'
        ? t('sahifa.reader.modeArabic')
        : t('sahifa.reader.modeTranslation');

  const translationLabel = translationLayer === 'en' ? 'EN' : 'UR';

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
              {t('sahifa.source')} · {meta.estimatedMinutes} min
            </Text>

            <SahifaReaderToolbar
              bookmarked={isBookmarked}
              onToggleBookmark={() => toggleBookmark(sahifaId, meta.titles.en)}
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
          <SahifaSectionBlock
            section={item}
            displayMode={displayMode}
            translationLayer={translationLayer}
            fontScale={fontScale}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {meta.hasAudio ? (
        <SahifaAudioBar
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

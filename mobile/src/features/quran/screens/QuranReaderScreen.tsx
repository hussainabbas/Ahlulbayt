import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { AyahBlock } from '../components/AyahBlock';
import { ReaderSettingsSheet } from '../components/ReaderSettingsSheet';
import { useQuranReader } from '../hooks/useQuranReader';
import type { QuranAyah } from '../types';

export function QuranReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'QuranReader'>>();
  const { surahNumber, ayah } = route.params;
  const listRef = useRef<FlatList<QuranAyah>>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { bundle, loading, error } = useQuranReader(surahNumber);

  const title = useMemo(() => {
    if (!bundle) return t('quran.title');
    if (locale === 'ur') return bundle.meta.nameUrdu;
    if (locale === 'ar') return bundle.meta.nameArabic;
    return bundle.meta.nameEnglish;
  }, [bundle, locale, t]);

  const subtitle = bundle
    ? `${bundle.meta.nameArabic} · ${bundle.meta.ayahCount} ${t('quran.ayahs')}`
    : undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
      headerRight: () => (
        <Pressable
          onPress={() => setSettingsOpen(true)}
          hitSlop={10}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel={t('quran.readerSettings')}
        >
          <Icon name="settings" size={20} color={theme.colors.accentPrimary} />
        </Pressable>
      ),
    });
  }, [navigation, t, theme, title]);

  useLayoutEffect(() => {
    if (!bundle || !ayah || ayah < 1) return;
    const index = bundle.ayahs.findIndex((item) => item.ayah === ayah);
    if (index < 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.2 });
    });
  }, [ayah, bundle]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.accentPrimary} />
          <Text variant="bodySm" color="secondary">
            {t('common.loadingContent')}
          </Text>
        </View>
      </Screen>
    );
  }

  if (error || !bundle) {
    return (
      <Screen>
        <EmptyState title={t('quran.notFound')} subtitle={error ?? t('common.emptySubtitle')} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      {subtitle ? (
        <View style={styles.intro}>
          <Text variant="bodySm" color="secondary">
            {subtitle}
          </Text>
          {!bundle.bundleVersion ? (
            <Text variant="caption" color="tertiary">
              {t('quran.downloadPrompt')}
            </Text>
          ) : null}
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={bundle.ayahs}
        keyExtractor={(item) => `${item.surah}:${item.ayah}`}
        renderItem={({ item }) => <AyahBlock ayah={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 100);
        }}
      />

      <ReaderSettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.blockGap,
  },
  headerBtn: {
    marginRight: layout.blockGap,
    padding: 4,
  },
  intro: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    paddingBottom: layout.blockGap,
    gap: 4,
  },
  list: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.sectionGap,
  },
});

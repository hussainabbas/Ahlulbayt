import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { CitationList } from '@/components/citations';
import { hasVerifiedCitation } from '@/core/citations';
import { Screen } from '@/components/ui/Screen';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';
import { layout } from '@/theme/layout';

import { DailyLifeReaderHero } from '../components/DailyLifeReaderHero';
import { DailyLifeReaderToolbar } from '../components/DailyLifeReaderToolbar';
import { DailyLifeSectionHeader } from '../components/DailyLifeSectionHeader';
import {
  DailyLifeSectionBlock,
  type DailyLifeDisplayMode,
  type DailyLifeTranslationLayer,
} from '../components/DailyLifeSectionBlock';
import { DailyLifeDuaRepository } from '../engine/dailyLifeDuaRepository';
import type { DailyLifeDuaId } from '../types';
import { getMetaTitle } from '../utils/localizedContent';

export function DailyLifeDuaReaderScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DailyLifeDuaReader'>>();
  const duaId = route.params.duaId as DailyLifeDuaId;

  const bundle = useMemo(() => DailyLifeDuaRepository.getBundle(duaId), [duaId]);
  const meta = bundle?.meta;

  const [displayMode, setDisplayMode] = useState<DailyLifeDisplayMode>('stacked');
  const [translationLayer, setTranslationLayer] = useState<DailyLifeTranslationLayer>(
    locale === 'ur' ? 'ur' : 'en',
  );
  const [fontScale, setFontScale] = useState(1);

  useLayoutEffect(() => {
    if (!meta) return;
    navigation.setOptions({
      headerShown: true,
      title: getMetaTitle(meta, locale),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [meta, locale, navigation, theme]);

  if (!meta || !bundle) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('dailyLifeDuas.notFound')}
        </Text>
      </Screen>
    );
  }

  const pending = meta.contentStatus === 'metadata_only' || bundle.sections.length === 0;
  const verified = hasVerifiedCitation(meta.attribution.citations);

  return (
    <Screen padded={false} edges={['left', 'right']}>
      <FlatList
        data={bundle.sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <DailyLifeReaderHero meta={meta} verified={verified && !pending} />

            <View
              style={[
                styles.modeWrap,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                  borderRadius: theme.radius.lg,
                },
              ]}
            >
              <SegmentControl
                options={[
                  { value: 'stacked', label: t('dua.reader.modeStacked') },
                  { value: 'arabic_only', label: t('dua.reader.modeArabic') },
                  { value: 'translation_only', label: t('dua.reader.modeTranslation') },
                ]}
                value={displayMode}
                onChange={(v) => setDisplayMode(v as DailyLifeDisplayMode)}
              />
            </View>

            <DailyLifeReaderToolbar
              onDecreaseFont={() => setFontScale((s) => Math.max(0.8, s - 0.1))}
              onIncreaseFont={() => setFontScale((s) => Math.min(1.4, s + 0.1))}
              showTranslationToggle={locale === 'ur'}
              translationLayer={translationLayer}
              onToggleTranslation={() =>
                setTranslationLayer((layer) => (layer === 'en' ? 'ur' : 'en'))
              }
            />

            {pending ? (
              <View
                style={[
                  styles.pendingBanner,
                  { backgroundColor: theme.colors.accentPrimaryMuted },
                ]}
              >
                <Text variant="bodySm" color="accent">
                  {t('dailyLifeDuas.pendingBody')}
                </Text>
              </View>
            ) : null}

            {meta.repeatCount ? (
              <View style={[styles.repeatPill, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text variant="caption" color="secondary" weight="600">
                  {t('dailyLifeDuas.repeatCount', { count: meta.repeatCount })}
                </Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <DailyLifeSectionBlock
            section={item}
            displayMode={displayMode}
            translationLayer={translationLayer}
            fontScale={fontScale}
          />
        )}
        ListFooterComponent={
          !pending && meta.attribution.citations.length > 0 ? (
            <View style={styles.footer}>
              <DailyLifeSectionHeader title={t('dailyLifeDuas.references')} />
              <CitationList
                citations={meta.attribution.citations}
                showDisclaimer={!verified}
                showTitle={false}
              />
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    paddingBottom: 40,
  },
  header: {
    gap: 14,
    marginBottom: 6,
  },
  modeWrap: {
    padding: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pendingBanner: {
    padding: 14,
    borderRadius: 12,
  },
  repeatPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  footer: {
    marginTop: 8,
    gap: 12,
  },
});

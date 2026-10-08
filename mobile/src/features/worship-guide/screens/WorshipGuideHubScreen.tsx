import { useCallback, useLayoutEffect, useMemo, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { WorshipGuideRow } from '../components/WorshipGuideRow';
import { WORSHIP_GUIDE_CATALOG } from '../constants/catalog';
import { WorshipGuideRepository } from '../engine/worshipGuideRepository';
import { useWorshipGuideProgressStore } from '../stores/progressStore';
import type { WorshipGuideId } from '../types';
import { pickLocalized } from '../utils/localizedText';

export function WorshipGuideHubScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rootNavigation = useRootNavigation();
  const byGuide = useWorshipGuideProgressStore((s) => s.byGuide);
  const lastSession = useWorshipGuideProgressStore((s) => s.lastSession);

  const wuduGuides = useMemo(
    () => WORSHIP_GUIDE_CATALOG.filter((c) => c.category === 'wudu'),
    [],
  );
  const ghuslGuides = useMemo(
    () => WORSHIP_GUIDE_CATALOG.filter((c) => c.category === 'ghusl'),
    [],
  );
  const adhanGuides = useMemo(
    () => WORSHIP_GUIDE_CATALOG.filter((c) => c.category === 'adhan'),
    [],
  );

  const openGuide = useCallback(
    (guideId: WorshipGuideId, step?: number) => {
      rootNavigation.navigate('WorshipGuideSession', { guideId, step });
    },
    [rootNavigation],
  );

  const progressPercent = useCallback(
    (guideId: WorshipGuideId) => {
      const progress = byGuide[guideId];
      const bundle = WorshipGuideRepository.getBundle(guideId);
      if (!progress || !bundle) return 0;
      const total = bundle.meta.stepCount;
      return total > 0 ? (progress.completedStepIds.length / total) * 100 : 0;
    },
    [byGuide],
  );

  const continueLabel = useMemo(() => {
    if (!lastSession) return null;
    const bundle = WorshipGuideRepository.getBundle(lastSession.guideId);
    if (!bundle) return null;
    return t('worshipGuide.continueSession', {
      title: pickLocalized(bundle.meta.titles, locale),
      step: lastSession.stepIndex + 1,
    });
  }, [lastSession, locale, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('worshipGuide.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false} safeTop={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text variant="bodySm" color="secondary">
            {t('worshipGuide.subtitle')}
          </Text>
        </View>

        {lastSession && continueLabel ? (
          <Pressable
            onPress={() => openGuide(lastSession.guideId, lastSession.stepIndex)}
            style={[styles.continueCard, { backgroundColor: theme.colors.accentPrimaryMuted }]}
          >
            <Text variant="bodySm" weight="600" color="accent">
              {t('worshipGuide.continue')}
            </Text>
            <Text variant="caption" color="secondary">
              {continueLabel}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => openGuide('wudu_standard')}
            style={[styles.cta, { backgroundColor: theme.colors.accentPrimary }]}
          >
            <Text variant="bodySm" weight="600" style={{ color: theme.colors.textInverse }}>
              {t('worshipGuide.startWudu')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => rootNavigation.navigate('PrayerAcademy')}
            style={[styles.cta, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.borderSubtle }]}
          >
            <Text variant="bodySm" weight="600" color="accent">
              {t('worshipGuide.startPrayer')}
            </Text>
          </Pressable>
        </View>

        <Section title={t('worshipGuide.sections.taharah')}>
          {wuduGuides.map((meta) => (
            <WorshipGuideRow
              key={meta.id}
              meta={meta}
              progressPercent={progressPercent(meta.id)}
              onPress={() => openGuide(meta.id)}
            />
          ))}
          {ghuslGuides.map((meta) => (
            <WorshipGuideRow
              key={meta.id}
              meta={meta}
              progressPercent={progressPercent(meta.id)}
              onPress={() => openGuide(meta.id)}
            />
          ))}
        </Section>

        <Section title={t('worshipGuide.sections.adhan')}>
          {adhanGuides.map((meta) => (
            <WorshipGuideRow
              key={meta.id}
              meta={meta}
              progressPercent={progressPercent(meta.id)}
              onPress={() => openGuide(meta.id)}
            />
          ))}
        </Section>

        <Section title={t('worshipGuide.sections.salah')}>
          <Pressable
            onPress={() => rootNavigation.navigate('PrayerAcademy')}
            style={[styles.salahCard, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceElevated }]}
          >
            <Text variant="bodyMd" weight="600">
              {t('prayerAcademy.title')}
            </Text>
            <Text variant="caption" color="secondary">
              {t('worshipGuide.salahHint')}
            </Text>
          </Pressable>
        </Section>

        <Text variant="caption" color="tertiary" style={styles.disclaimer}>
          {t('worshipGuide.disclaimer')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="overline" color="secondary">
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: layout.screenPaddingX,
    paddingBottom: layout.sectionGap * 2,
    gap: layout.blockGap,
  },
  hero: { gap: 6 },
  continueCard: {
    padding: layout.blockGap,
    borderRadius: 14,
    gap: 4,
  },
  ctaRow: { flexDirection: 'row', gap: 10 },
  cta: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  section: { gap: 10, marginTop: 8 },
  sectionBody: { gap: 8 },
  salahCard: {
    padding: layout.blockGap,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  disclaimer: { marginTop: 12, textAlign: 'center' },
});

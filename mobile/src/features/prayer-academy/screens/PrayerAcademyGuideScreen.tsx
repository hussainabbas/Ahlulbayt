import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { DifficultyToggle } from '../components/DifficultyToggle';
import { GuidedModeBar } from '../components/GuidedModeBar';
import { PrayerRakatBreakdown } from '../components/PrayerRakatBreakdown';
import { PrayerStepBlock } from '../components/PrayerStepBlock';
import { WorshipAvatarStage } from '@/features/worship-simulator/components/WorshipAvatarStage';
import { useWorshipSimulator } from '@/features/worship-simulator/hooks/useWorshipSimulator';
import { PrayerAcademyRepository } from '../engine/prayerAcademyRepository';
import { usePrayerAcademyBookmarkStore } from '../stores/bookmarkStore';
import { usePrayerAcademyProgressStore } from '../stores/progressStore';
import { usePrayerAcademyReaderStore } from '../stores/readerStore';
import type { GuideDifficulty } from '../types';
import { pickLocalized } from '../utils/localizedText';

type GuideRoute = RouteProp<RootStackParamList, 'PrayerAcademyGuide'>;

export function PrayerAcademyGuideScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<GuideRoute>();
  const { prayerId } = route.params;

  const readerPrefs = usePrayerAcademyReaderStore();
  const [difficulty, setDifficulty] = useState<GuideDifficulty>(readerPrefs.defaultDifficulty);
  const [guided, setGuided] = useState(readerPrefs.guidedModeDefault);
  const [stepIndex, setStepIndex] = useState(route.params.step ?? 0);

  const toggleBookmark = usePrayerAcademyBookmarkStore((s) => s.toggleBookmark);
  const isBookmarked = usePrayerAcademyBookmarkStore((s) => s.isBookmarked);
  const setStepProgress = usePrayerAcademyProgressStore((s) => s.setStepProgress);
  const markComplete = usePrayerAcademyProgressStore((s) => s.markComplete);
  const progress = usePrayerAcademyProgressStore((s) => s.byPrayer[prayerId]);

  const bundle = useMemo(() => PrayerAcademyRepository.getBundle(prayerId), [prayerId]);
  const steps = useMemo(
    () => PrayerAcademyRepository.getSteps(prayerId, difficulty),
    [prayerId, difficulty],
  );

  const { pose, isTransitioning, goToStep } = useWorshipSimulator(steps);

  useEffect(() => {
    if (guided) void goToStep(stepIndex);
  }, [guided, stepIndex, goToStep]);

  const bookmarked = isBookmarked(prayerId);

  useLayoutEffect(() => {
    if (!bundle) return;
    navigation.setOptions({
      headerShown: true,
      title: pickLocalized(bundle.meta.titles, locale),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
      headerRight: () => (
        <Pressable onPress={() => toggleBookmark(prayerId)} hitSlop={8} style={styles.headerBtn}>
          <Icon
            name="bookmark"
            filled={bookmarked}
            size={20}
            color={bookmarked ? theme.colors.accentPrimary : theme.colors.textTertiary}
          />
        </Pressable>
      ),
    });
  }, [navigation, bundle, locale, theme, bookmarked, prayerId, toggleBookmark]);

  const onNext = useCallback(() => {
    const step = steps[stepIndex];
    if (step) setStepProgress(prayerId, step.id, difficulty, guided);
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      markComplete(prayerId);
    }
  }, [stepIndex, steps, prayerId, difficulty, guided, setStepProgress, markComplete]);

  const onPrev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  if (!bundle) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('prayerAcademy.notFound')}
        </Text>
      </Screen>
    );
  }

  const activeStep = guided ? steps[stepIndex] : undefined;

  return (
    <Screen scroll={false} padded={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="bodySm" color="secondary">
          {pickLocalized(bundle.meta.purpose, locale)}
        </Text>

        <DifficultyToggle value={difficulty} onChange={setDifficulty} />

        <View style={styles.section}>
          <Text variant="label" color="secondary">
            {t('prayerAcademy.rakatStructure')}
          </Text>
          <PrayerRakatBreakdown units={bundle.rakatStructure} />
        </View>

        {bundle.timingRules.length ? (
          <View style={styles.section}>
            <Text variant="label" color="secondary">
              {t('prayerAcademy.timing')}
            </Text>
            {bundle.timingRules.map((rule) => (
              <View
                key={rule.id}
                style={[styles.infoBox, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Text variant="bodySm" weight="600">
                  {pickLocalized(rule.title, locale)}
                </Text>
                <Text variant="caption" color="secondary">
                  {pickLocalized(rule.body, locale)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {bundle.conditions.length ? (
          <View style={styles.section}>
            <Text variant="label" color="secondary">
              {t('prayerAcademy.conditions')}
            </Text>
            {bundle.conditions.slice(0, 3).map((cond) => (
              <View
                key={cond.id}
                style={[styles.infoBox, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Text variant="bodySm" weight="600">
                  {pickLocalized(cond.title, locale)}
                </Text>
                <Text variant="caption" color="secondary">
                  {pickLocalized(cond.body, locale)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {bundle.sunniDifferences?.length ? (
          <View style={styles.section}>
            <Text variant="label" color="secondary">
              {t('prayerAcademy.jafariNotes')}
            </Text>
            {bundle.sunniDifferences.map((note, i) => (
              <View
                key={i}
                style={[styles.infoBox, { backgroundColor: theme.colors.accentPrimaryMuted }]}
              >
                <Text variant="caption" weight="600" color="accent">
                  {pickLocalized(note.topic, locale)}
                </Text>
                <Text variant="caption" color="secondary">
                  {pickLocalized(note.jafari, locale)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text variant="label" color="secondary">
            {guided ? t('prayerAcademy.currentStep') : t('prayerAcademy.allSteps')}
          </Text>
          {guided && activeStep ? (
            <>
              <WorshipAvatarStage
                pose={pose}
                isTransitioning={isTransitioning}
                subtitle={activeStep.arabic ?? null}
              />
              <PrayerStepBlock
                step={activeStep}
                index={stepIndex}
                active
                showArabic={readerPrefs.showArabic}
                showTransliteration={readerPrefs.showTransliteration}
                showFiqhRefs={readerPrefs.showFiqhRefs}
              />
            </>
          ) : (
            steps.map((step, index) => (
              <PrayerStepBlock
                key={step.id}
                step={step}
                index={index}
                showArabic={readerPrefs.showArabic}
                showTransliteration={readerPrefs.showTransliteration}
                showFiqhRefs={readerPrefs.showFiqhRefs}
                active={progress?.lastStepId === step.id}
              />
            ))
          )}
        </View>

        {progress?.completedAt ? (
          <View style={[styles.completeBadge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
            <Icon name="check" size={16} color={theme.colors.accentPrimary} />
            <Text variant="bodySm" color="accent">
              {t('prayerAcademy.completed')}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <GuidedModeBar
        current={stepIndex + 1}
        total={Math.max(steps.length, 1)}
        guided={guided}
        onToggleGuided={() => setGuided((g) => !g)}
        onPrev={onPrev}
        onNext={onNext}
        canPrev={stepIndex > 0}
        canNext={stepIndex < steps.length - 1 || !progress?.completedAt}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: layout.screenPadding,
    paddingBottom: layout.sectionGap,
    gap: layout.sectionGap,
  },
  section: { gap: layout.listGap },
  infoBox: { padding: layout.blockGap, borderRadius: 12, gap: 4 },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: layout.blockGap,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  headerBtn: { marginRight: 4 },
});

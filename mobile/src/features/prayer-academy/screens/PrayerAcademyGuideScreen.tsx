import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { GuidedNavigationBar } from '@/components/guided/GuidedNavigationBar';
import { GuidedProgressHeader } from '@/components/guided/GuidedProgressHeader';
import { GuidedStepPager } from '@/components/guided/GuidedStepPager';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { DifficultyToggle } from '../components/DifficultyToggle';
import { PrayerRakatBreakdown } from '../components/PrayerRakatBreakdown';
import { PrayerStepBlock } from '../components/PrayerStepBlock';
import { WorshipAvatarStage } from '@/features/worship-simulator/components/WorshipAvatarStage';
import { useWorshipSimulator } from '@/features/worship-simulator/hooks/useWorshipSimulator';
import { PrayerAcademyRepository } from '../engine/prayerAcademyRepository';
import { usePrayerAcademyBookmarkStore } from '../stores/bookmarkStore';
import { usePrayerAcademyProgressStore } from '../stores/progressStore';
import { usePrayerAcademyReaderStore } from '../stores/readerStore';
import type { GuideDifficulty, PrayerAcademyStep } from '../types';
import { getAvatarSubtitle } from '../utils/avatarSubtitle';
import { pickLocalized } from '../utils/localizedText';

type GuideRoute = RouteProp<RootStackParamList, 'PrayerAcademyGuide'>;

const DIFFICULTY_LABELS: Record<GuideDifficulty, string> = {
  beginner: 'prayerAcademy.difficulty.beginner',
  advanced: 'prayerAcademy.difficulty.advanced',
};

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

  const cycleDifficulty = useCallback(() => {
    setDifficulty((d) => (d === 'beginner' ? 'advanced' : 'beginner'));
    setStepIndex(0);
  }, []);

  const bookmarked = isBookmarked(prayerId);
  const isLastStep = stepIndex >= steps.length - 1;

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

  const handleStepIndexChange = useCallback(
    (newIndex: number) => {
      if (newIndex < stepIndex) {
        setStepIndex(newIndex);
        return;
      }
      if (newIndex > stepIndex) {
        onNext();
      }
    },
    [stepIndex, onNext],
  );

  const renderGuidedStep = useCallback(
    (step: PrayerAcademyStep, index: number) => (
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        {index === stepIndex ? (
          <WorshipAvatarStage
            pose={pose}
            isTransitioning={isTransitioning}
            subtitle={getAvatarSubtitle(step)}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surfaceMuted }]} />
        )}
        <PrayerStepBlock
          step={step}
          index={index}
          active
          showArabic={readerPrefs.showArabic}
          showTransliteration={readerPrefs.showTransliteration}
          showFiqhRefs={readerPrefs.showFiqhRefs}
        />
      </ScrollView>
    ),
    [stepIndex, pose, isTransitioning, readerPrefs, theme.colors.surfaceMuted],
  );

  if (!bundle) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('prayerAcademy.notFound')}
        </Text>
      </Screen>
    );
  }

  const difficultyLabel = t(DIFFICULTY_LABELS[difficulty] ?? DIFFICULTY_LABELS.beginner);

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      {guided ? (
        <>
          <GuidedProgressHeader
            modeLabel={difficultyLabel}
            onModePress={cycleDifficulty}
            current={stepIndex + 1}
            total={steps.length}
          />
          <GuidedStepPager
            steps={steps}
            stepIndex={stepIndex}
            enabled={guided}
            canSwipeForward
            onStepIndexChange={handleStepIndexChange}
            keyExtractor={(step) => step.id}
            renderStep={renderGuidedStep}
          />
        </>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={styles.section}>
            <Text variant="label" color="secondary">
              {t('prayerAcademy.allSteps')}
            </Text>
            {steps.map((step, index) => (
              <PrayerStepBlock
                key={step.id}
                step={step}
                index={index}
                showArabic={readerPrefs.showArabic}
                showTransliteration={readerPrefs.showTransliteration}
                showFiqhRefs={readerPrefs.showFiqhRefs}
                active={progress?.lastStepId === step.id}
              />
            ))}
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
      )}

      <GuidedNavigationBar
        current={stepIndex + 1}
        total={Math.max(steps.length, 1)}
        guided={guided}
        guidedLabel={t('prayerAcademy.guided')}
        stepOfLabel={t('prayerAcademy.stepOf', {
          current: stepIndex + 1,
          total: steps.length,
        })}
        onToggleGuided={() => setGuided((g) => !g)}
        onPrev={onPrev}
        onNext={onNext}
        canPrev={guided && stepIndex > 0}
        canNext={guided && (stepIndex < steps.length - 1 || !progress?.completedAt)}
        isLastStep={guided && isLastStep}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scroll: {
    padding: layout.screenPaddingX,
    paddingBottom: layout.sectionGap,
    gap: layout.sectionGap,
  },
  pageContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 24,
    gap: layout.blockGap,
  },
  avatarPlaceholder: {
    height: 220,
    borderRadius: 16,
  },
  section: { gap: layout.listGap },
  infoBox: { padding: layout.blockGap, borderRadius: 14, gap: 4 },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: layout.blockGap,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  headerBtn: { marginRight: 4 },
});

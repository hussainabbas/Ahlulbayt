import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { GuidedNavigationBar } from '@/components/guided/GuidedNavigationBar';
import { GuidedProgressHeader } from '@/components/guided/GuidedProgressHeader';
import { GuidedStepPager } from '@/components/guided/GuidedStepPager';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { WorshipStepBlock } from '../components/WorshipStepBlock';
import { WorshipAvatarStage } from '@/features/worship-simulator/components/WorshipAvatarStage';
import { useWorshipSimulator } from '@/features/worship-simulator/hooks/useWorshipSimulator';
import { StepProgressionEngine } from '../engine/stepProgressionEngine';
import { WorshipGuideRepository } from '../engine/worshipGuideRepository';
import { useWorshipGuideProgressStore } from '../stores/progressStore';
import { useWorshipGuideReaderStore } from '../stores/readerStore';
import type { GuideLearningMode, WorshipGuideId, WorshipGuideStep } from '../types';
import { pickLocalized } from '../utils/localizedText';

type SessionRoute = RouteProp<RootStackParamList, 'WorshipGuideSession'>;

const MODES: GuideLearningMode[] = ['beginner', 'standard', 'scholar'];

export function WorshipGuideSessionScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SessionRoute>();
  const { guideId: guideIdParam } = route.params;
  const guideId = guideIdParam as WorshipGuideId;

  const readerPrefs = useWorshipGuideReaderStore();
  const [mode, setMode] = useState<GuideLearningMode>(readerPrefs.defaultMode);
  const [guided, setGuided] = useState(readerPrefs.guidedModeDefault);
  const [stepIndex, setStepIndex] = useState(route.params.step ?? 0);
  const [confirmed, setConfirmed] = useState(false);

  const markComplete = useWorshipGuideProgressStore((s) => s.markComplete);

  const bundle = useMemo(() => WorshipGuideRepository.getBundle(guideId), [guideId]);
  const steps = useMemo(() => StepProgressionEngine.getSteps(guideId, mode), [guideId, mode]);
  const { pose, isTransitioning, animationAssetKey, goToStep } = useWorshipSimulator(steps);

  useEffect(() => {
    if (guided) void goToStep(stepIndex);
  }, [guided, stepIndex, goToStep]);

  useLayoutEffect(() => {
    if (!bundle) return;
    navigation.setOptions({
      headerShown: true,
      title: pickLocalized(bundle.meta.titles, locale),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, bundle, locale, theme]);

  const cycleMode = useCallback(() => {
    setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]!);
    setStepIndex(0);
    setConfirmed(false);
  }, []);

  const activeStep = steps[stepIndex];
  const needsConfirm = Boolean(activeStep?.confirmPrompt);
  const canAdvance = !needsConfirm || confirmed;
  const isLastStep = stepIndex >= steps.length - 1;

  const onNext = useCallback(async () => {
    const step = steps[stepIndex];
    if (!step) return;
    if (step.confirmPrompt && !confirmed && guided) return;

    await StepProgressionEngine.onStepComplete(guideId, step, mode, guided);

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      setConfirmed(false);
    } else {
      markComplete(guideId);
    }
  }, [stepIndex, steps, guideId, mode, guided, confirmed, markComplete]);

  const onPrev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
    setConfirmed(false);
  }, []);

  const handleStepIndexChange = useCallback(
    (newIndex: number) => {
      if (newIndex < stepIndex) {
        setStepIndex(newIndex);
        setConfirmed(false);
        return;
      }
      if (newIndex > stepIndex && canAdvance) {
        void onNext();
      }
    },
    [stepIndex, canAdvance, onNext],
  );

  const renderGuidedStep = useCallback(
    (step: WorshipGuideStep, index: number) => {
      const stepNeedsConfirm = Boolean(step.confirmPrompt);
      const stepConfirmed = index === stepIndex ? confirmed : false;

      return (
        <ScrollView
          contentContainerStyle={styles.pageContent}
          showsVerticalScrollIndicator={false}
        >
          {index === stepIndex ? (
            <WorshipAvatarStage
              pose={pose}
              isTransitioning={isTransitioning}
              animationAssetKey={animationAssetKey}
              subtitle={step.arabicText ?? null}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surfaceMuted }]} />
          )}

          <WorshipStepBlock
            step={step}
            index={index}
            mode={mode}
            showArabic={readerPrefs.showArabic}
            showTransliteration={readerPrefs.showTransliteration}
            active
          />

          {stepNeedsConfirm ? (
            <Pressable
              onPress={() => index === stepIndex && setConfirmed((c) => !c)}
              disabled={index !== stepIndex}
              style={[
                styles.confirm,
                {
                  backgroundColor: stepConfirmed
                    ? theme.colors.accentPrimaryMuted
                    : theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                  opacity: index === stepIndex ? 1 : 0.7,
                },
              ]}
            >
              <Text variant="bodySm" color={stepConfirmed ? 'accent' : 'secondary'}>
                {stepConfirmed ? '✓ ' : '☐ '}
                {pickLocalized(step.confirmPrompt!, locale)}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>
      );
    },
    [
      stepIndex,
      confirmed,
      pose,
      isTransitioning,
      animationAssetKey,
      mode,
      readerPrefs.showArabic,
      readerPrefs.showTransliteration,
      locale,
      theme.colors,
    ],
  );

  if (!bundle) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('worshipGuide.notFound')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      {guided ? (
        <>
          <GuidedProgressHeader
            modeLabel={t(`worshipGuide.mode.${mode}`)}
            onModePress={cycleMode}
            current={stepIndex + 1}
            total={steps.length}
          />
          <GuidedStepPager
            steps={steps}
            stepIndex={stepIndex}
            enabled={guided}
            canSwipeForward={canAdvance}
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
          <GuidedProgressHeader
            modeLabel={t(`worshipGuide.mode.${mode}`)}
            onModePress={cycleMode}
            current={1}
            total={steps.length}
          />
          {steps.map((step, index) => (
            <WorshipStepBlock
              key={step.id}
              step={step}
              index={index}
              mode={mode}
              showArabic={readerPrefs.showArabic}
              showTransliteration={readerPrefs.showTransliteration}
            />
          ))}

          {bundle.invalidators?.length && mode === 'scholar' ? (
            <View style={[styles.invalidators, { backgroundColor: theme.colors.surfaceMuted }]}>
              <Text variant="bodySm" weight="600">
                {t('worshipGuide.invalidators')}
              </Text>
              {bundle.invalidators.map((inv) => (
                <Text key={inv.id} variant="caption" color="secondary">
                  • {pickLocalized(inv.title, locale)} — {pickLocalized(inv.body, locale)}
                </Text>
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}

      <GuidedNavigationBar
        current={stepIndex + 1}
        total={steps.length}
        guided={guided}
        guidedLabel={t('worshipGuide.guided')}
        stepOfLabel={t('worshipGuide.stepOf', { current: stepIndex + 1, total: steps.length })}
        onToggleGuided={() => setGuided((g) => !g)}
        onPrev={onPrev}
        onNext={() => void onNext()}
        canPrev={guided && stepIndex > 0}
        canNext={guided && canAdvance}
        isLastStep={guided && isLastStep}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scroll: {
    padding: layout.screenPaddingX,
    paddingBottom: 24,
    gap: layout.blockGap,
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
  confirm: {
    padding: layout.blockGap,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
    justifyContent: 'center',
  },
  invalidators: {
    padding: layout.blockGap,
    borderRadius: 14,
    gap: 6,
    marginTop: 8,
  },
});

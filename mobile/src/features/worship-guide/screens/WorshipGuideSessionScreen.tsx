import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { GuidedWizardBar } from '../components/GuidedWizardBar';
import { WorshipStepBlock } from '../components/WorshipStepBlock';
import { WorshipAvatarStage } from '@/features/worship-simulator/components/WorshipAvatarStage';
import { useWorshipSimulator } from '@/features/worship-simulator/hooks/useWorshipSimulator';
import { StepProgressionEngine } from '../engine/stepProgressionEngine';
import { WorshipGuideRepository } from '../engine/worshipGuideRepository';
import { useWorshipGuideProgressStore } from '../stores/progressStore';
import { useWorshipGuideReaderStore } from '../stores/readerStore';
import type { GuideLearningMode, WorshipGuideId } from '../types';
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
  const { pose, isTransitioning, goToStep } = useWorshipSimulator(steps);

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

  if (!bundle) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('worshipGuide.notFound')}
        </Text>
      </Screen>
    );
  }

  const activeStep = guided ? steps[stepIndex] : undefined;
  const needsConfirm = Boolean(activeStep?.confirmPrompt);
  const canAdvance = !needsConfirm || confirmed;

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <View style={styles.modeBar}>
        <Pressable onPress={cycleMode} style={styles.modeBtn}>
          <Text variant="caption" color="accent">
            {t(`worshipGuide.mode.${mode}`)}
          </Text>
        </Pressable>
        {guided ? (
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i <= stepIndex ? theme.colors.accentPrimary : theme.colors.surfaceMuted,
                  },
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {guided && activeStep ? (
          <>
            <WorshipAvatarStage
              pose={pose}
              isTransitioning={isTransitioning}
              subtitle={activeStep.arabicText ?? null}
            />
            <WorshipStepBlock
              step={activeStep}
              index={stepIndex}
              mode={mode}
              showArabic={readerPrefs.showArabic}
              showTransliteration={readerPrefs.showTransliteration}
              active
            />
            {activeStep.confirmPrompt ? (
              <Pressable
                onPress={() => setConfirmed((c) => !c)}
                style={[
                  styles.confirm,
                  {
                    backgroundColor: confirmed
                      ? theme.colors.accentPrimaryMuted
                      : theme.colors.surfaceElevated,
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="bodySm" color={confirmed ? 'accent' : 'secondary'}>
                  {confirmed ? '✓ ' : '☐ '}
                  {pickLocalized(activeStep.confirmPrompt, locale)}
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          steps.map((step, index) => (
            <WorshipStepBlock
              key={step.id}
              step={step}
              index={index}
              mode={mode}
              showArabic={readerPrefs.showArabic}
              showTransliteration={readerPrefs.showTransliteration}
            />
          ))
        )}

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

      <GuidedWizardBar
        current={stepIndex + 1}
        total={steps.length}
        guided={guided}
        onToggleGuided={() => setGuided((g) => !g)}
        onPrev={onPrev}
        onNext={() => void onNext()}
        onRepeatAudio={() => {
          // Phase 2: play activeStep audioAssetKey
        }}
        canPrev={stepIndex > 0}
        canNext={guided && canAdvance && stepIndex <= steps.length - 1}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 8,
  },
  modeBtn: { padding: 6 },
  dots: { flexDirection: 'row', gap: 4, flex: 1, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  scrollView: { flex: 1 },
  scroll: {
    padding: layout.screenPaddingX,
    paddingBottom: 24,
    gap: layout.blockGap,
  },
  confirm: {
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  invalidators: {
    padding: layout.blockGap,
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
  },
});

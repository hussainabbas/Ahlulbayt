import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import type { OnboardingStep } from '@/features/onboarding/types';
import { getStepIndex, ONBOARDING_STEPS } from '@/features/onboarding/types';

interface OnboardingShellProps {
  step: OnboardingStep;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
  footerNote?: string;
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  onContinue,
  onBack,
  onSkip,
  continueLabel,
  continueDisabled = false,
  showBack = true,
  footerNote,
}: OnboardingShellProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const stepIndex = getStepIndex(step);
  const progress = (stepIndex + 1) / ONBOARDING_STEPS.length;

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.backgroundPrimary,
          paddingTop: insets.top + theme.spacing[4],
          paddingBottom: insets.bottom + theme.spacing[4],
        },
      ]}
    >
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <View style={styles.headerRow}>
          {showBack && onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.back')}
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            >
              <Text variant="bodyMd" color="accent">
                {t('onboarding.back')}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          {onSkip ? (
            <Pressable
              onPress={onSkip}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('onboarding.skip')}
              style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            >
              <Text variant="bodySm" color="tertiary">
                {t('onboarding.skip')}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceMuted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.accentPrimary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <Text variant="caption" color="tertiary" style={styles.stepLabel}>
          {t('onboarding.stepOf', { current: stepIndex + 1, total: ONBOARDING_STEPS.length })}
        </Text>
      </View>

      <Animated.View
        key={step}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(120)}
        style={[styles.body, { paddingHorizontal: theme.spacing[5] }]}
      >
        <View style={styles.titleBlock}>
          <Text variant="displayMd" style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodyMd" color="secondary" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.content}>{children}</View>
      </Animated.View>

      <View style={[styles.footer, { paddingHorizontal: theme.spacing[5], gap: theme.spacing[3] }]}>
        {footerNote ? (
          <Text variant="caption" color="tertiary" style={styles.footerNote}>
            {footerNote}
          </Text>
        ) : null}
        <Button
          label={continueLabel ?? t('onboarding.continue')}
          onPress={onContinue}
          disabled={continueDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  backBtn: {
    minWidth: 64,
  },
  backPlaceholder: {
    width: 64,
  },
  progressTrack: {
    height: 3,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },
  stepLabel: {
    textAlign: 'center',
  },
  body: {
    flex: 1,
  },
  titleBlock: {
    gap: 12,
    marginBottom: 28,
    marginTop: 8,
  },
  title: {},
  subtitle: {},
  content: {
    flex: 1,
  },
  footer: {
    paddingTop: 8,
  },
  footerNote: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

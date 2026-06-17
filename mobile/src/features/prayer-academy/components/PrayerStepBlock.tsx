import { StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { Text } from '@/components/ui/Text';
import { citationsFromFiqhRefs, mergeCitations } from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { PrayerGuideStep } from '../types';
import { pickLocalized, pickLocalizedList } from '../utils/localizedText';

interface PrayerStepBlockProps {
  step: PrayerGuideStep;
  index: number;
  showArabic: boolean;
  showTransliteration: boolean;
  showFiqhRefs: boolean;
  active?: boolean;
}

export function PrayerStepBlock({
  step,
  index,
  showArabic,
  showTransliteration,
  showFiqhRefs,
  active,
}: PrayerStepBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const stepCitations = mergeCitations(
    step.citations,
    showFiqhRefs ? citationsFromFiqhRefs(step.fiqhRefs, locale) : undefined,
  );

  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor: active ? theme.colors.accentPrimaryMuted : theme.colors.surfaceElevated,
          borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.indexBadge, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text variant="caption" weight="600" color="accent">
            {index + 1}
          </Text>
        </View>
        <Text variant="bodyMd" weight="600" style={styles.title}>
          {pickLocalized(step.titles, locale)}
        </Text>
      </View>

      <Text variant="bodySm" color="secondary">
        {pickLocalized(step.body, locale)}
      </Text>

      {step.advancedBody ? (
        <Text variant="caption" color="tertiary" style={styles.advanced}>
          {pickLocalized(step.advancedBody, locale)}
        </Text>
      ) : null}

      {showArabic && step.arabic ? (
        <Text variant="bodyMd" style={[styles.arabic, { color: theme.colors.textPrimary }]}>
          {step.arabic}
        </Text>
      ) : null}

      {showTransliteration && step.transliteration ? (
        <Text variant="caption" color="tertiary" style={styles.translit}>
          {pickLocalized(step.transliteration, locale)}
        </Text>
      ) : null}

      {step.checklist?.length ? (
        <View style={styles.checklist}>
          {pickLocalizedList(step.checklist, locale).map((line, i) => (
            <Text key={i} variant="bodySm" color="secondary">
              {i + 1}. {line}
            </Text>
          ))}
        </View>
      ) : null}

      {showFiqhRefs && stepCitations.length > 0 ? (
        <CitationList citations={stepCitations} compact />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: layout.blockGap,
    gap: layout.listGap,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1 },
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 32,
    fontSize: 20,
  },
  translit: { fontStyle: 'italic' },
  checklist: { gap: 4, marginTop: 4 },
  advanced: { marginTop: 4 },
});

import { StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { RecitationPanel, isRecitationKind } from '@/components/guided/RecitationPanel';
import type { GuideContentLocale } from '@/components/guided/types';
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
  contentLocale: GuideContentLocale;
  fontScale?: number;
  active?: boolean;
}

export function PrayerStepBlock({
  step,
  index,
  showArabic,
  showTransliteration,
  showFiqhRefs,
  contentLocale,
  fontScale = 1,
  active,
}: PrayerStepBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const stepCitations = mergeCitations(
    step.citations,
    showFiqhRefs ? citationsFromFiqhRefs(step.fiqhRefs, locale) : undefined,
  );

  const titleSize = 16 * fontScale;
  const bodySize = 14 * fontScale;
  const bodyLineHeight = 22 * fontScale;

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
        <Text
          variant="bodyMd"
          weight="600"
          style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.4 }]}
        >
          {pickLocalized(step.titles, contentLocale)}
        </Text>
      </View>

      <Text
        variant="bodySm"
        color="secondary"
        style={{ fontSize: bodySize, lineHeight: bodyLineHeight }}
      >
        {pickLocalized(step.body, contentLocale)}
      </Text>

      {step.advancedBody ? (
        <Text
          variant="caption"
          color="tertiary"
          style={[styles.advanced, { fontSize: 12 * fontScale, lineHeight: 18 * fontScale }]}
        >
          {pickLocalized(step.advancedBody, contentLocale)}
        </Text>
      ) : null}

      <RecitationPanel
        arabic={step.arabic}
        transliteration={step.transliteration}
        translation={step.translation}
        showArabic={showArabic}
        showTransliteration={showTransliteration}
        forceShowArabic={isRecitationKind(step.kind)}
        contentLocale={contentLocale}
        fontScale={fontScale}
      />

      {step.checklist?.length ? (
        <View style={styles.checklist}>
          {pickLocalizedList(step.checklist, contentLocale).map((line, i) => (
            <Text
              key={i}
              variant="bodySm"
              color="secondary"
              style={{ fontSize: bodySize, lineHeight: bodyLineHeight }}
            >
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
  checklist: { gap: 4, marginTop: 4 },
  advanced: { marginTop: 4 },
});

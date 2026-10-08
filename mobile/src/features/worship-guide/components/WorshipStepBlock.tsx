import { StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { RecitationPanel, isRecitationKind } from '@/components/guided/RecitationPanel';
import type { GuideContentLocale } from '@/components/guided/types';
import { Text } from '@/components/ui/Text';
import { citationsFromFiqhRefs, mergeCitations } from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { WorshipGuideStep } from '../types';
import { pickLocalized, pickLocalizedList } from '../utils/localizedText';

interface WorshipStepBlockProps {
  step: WorshipGuideStep;
  index: number;
  mode: 'beginner' | 'standard' | 'scholar';
  showArabic: boolean;
  showTransliteration: boolean;
  contentLocale: GuideContentLocale;
  fontScale?: number;
  active?: boolean;
}

export function WorshipStepBlock({
  step,
  index,
  mode,
  showArabic,
  showTransliteration,
  contentLocale,
  fontScale = 1,
  active,
}: WorshipStepBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const showScholar = mode === 'scholar';
  const stepCitations = mergeCitations(
    step.citations,
    showScholar ? citationsFromFiqhRefs(step.fiqhRefs, locale) : undefined,
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
        <View style={[styles.badge, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text variant="caption" weight="600" color="accent">
            {index + 1}
          </Text>
        </View>
        <View style={styles.titleCol}>
          <Text
            variant="bodyMd"
            weight="600"
            style={{ fontSize: titleSize, lineHeight: titleSize * 1.4 }}
          >
            {pickLocalized(step.title, contentLocale)}
          </Text>
          {!step.isRequired ? (
            <Text
              variant="caption"
              color="tertiary"
              style={{ fontSize: 12 * fontScale, lineHeight: 18 * fontScale }}
            >
              {pickLocalized({ en: 'Recommended', ur: 'مستحب', ar: 'مستحب' }, contentLocale)}
            </Text>
          ) : null}
        </View>
      </View>

      <Text
        variant="bodySm"
        color="secondary"
        style={{ fontSize: bodySize, lineHeight: bodyLineHeight }}
      >
        {pickLocalized(step.body, contentLocale)}
      </Text>

      {showScholar && step.scholarBody ? (
        <Text
          variant="caption"
          color="tertiary"
          style={[styles.scholar, { fontSize: 12 * fontScale, lineHeight: 18 * fontScale }]}
        >
          {pickLocalized(step.scholarBody, contentLocale)}
        </Text>
      ) : null}

      <RecitationPanel
        arabic={step.arabicText}
        transliteration={step.transliteration}
        translation={step.translation}
        showArabic={showArabic}
        showTransliteration={showTransliteration}
        forceShowArabic={isRecitationKind(step.kind) || Boolean(step.arabicText && step.translation)}
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
              ☐ {line}
            </Text>
          ))}
        </View>
      ) : null}

      {showScholar && step.commonErrors?.length ? (
        <View style={[styles.errors, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text
            variant="caption"
            weight="600"
            color="accent"
            style={{ fontSize: 12 * fontScale, lineHeight: 18 * fontScale }}
          >
            {pickLocalized({ en: 'Common mistakes', ur: 'عام غلطیاں', ar: 'أخطاء شائعة' }, contentLocale)}
          </Text>
          {pickLocalizedList(step.commonErrors, contentLocale).map((err, i) => (
            <Text
              key={i}
              variant="caption"
              color="secondary"
              style={{ fontSize: 12 * fontScale, lineHeight: 18 * fontScale }}
            >
              • {err}
            </Text>
          ))}
        </View>
      ) : null}

      {showScholar && stepCitations.length > 0 ? (
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
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: { flex: 1, gap: 2 },
  checklist: { gap: 4 },
  errors: { padding: 10, borderRadius: 8, gap: 4 },
  scholar: { marginTop: 4 },
});

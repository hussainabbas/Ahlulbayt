import { StyleSheet, View } from 'react-native';

import { ReferenceList } from '@/components/references';
import { Text } from '@/components/ui/Text';
import { fiqhRefsToIslamic } from '@/core/references';
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
  active?: boolean;
}

export function WorshipStepBlock({
  step,
  index,
  mode,
  showArabic,
  showTransliteration,
  active,
}: WorshipStepBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const showScholar = mode === 'scholar';

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
          <Text variant="bodyMd" weight="600">
            {pickLocalized(step.title, locale)}
          </Text>
          {!step.isRequired ? (
            <Text variant="caption" color="tertiary">
              {pickLocalized({ en: 'Recommended', ur: 'مستحب', ar: 'مستحب' }, locale)}
            </Text>
          ) : null}
        </View>
      </View>

      <Text variant="bodySm" color="secondary">
        {pickLocalized(step.body, locale)}
      </Text>

      {showScholar && step.scholarBody ? (
        <Text variant="caption" color="tertiary" style={styles.scholar}>
          {pickLocalized(step.scholarBody, locale)}
        </Text>
      ) : null}

      {showArabic && step.arabicText ? (
        <Text variant="bodyMd" style={[styles.arabic, { color: theme.colors.textPrimary }]}>
          {step.arabicText}
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
              ☐ {line}
            </Text>
          ))}
        </View>
      ) : null}

      {showScholar && step.commonErrors?.length ? (
        <View style={[styles.errors, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text variant="caption" weight="600" color="accent">
            {pickLocalized({ en: 'Common mistakes', ur: 'عام غلطیاں', ar: 'أخطاء شائعة' }, locale)}
          </Text>
          {pickLocalizedList(step.commonErrors, locale).map((err, i) => (
            <Text key={i} variant="caption" color="secondary">
              • {err}
            </Text>
          ))}
        </View>
      ) : null}

      {showScholar && step.fiqhRefs?.length ? (
        <ReferenceList
          references={fiqhRefsToIslamic(step.fiqhRefs, step.id)}
          compact
        />
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
  arabic: { textAlign: 'right', writingDirection: 'rtl', lineHeight: 32, fontSize: 20 },
  translit: { fontStyle: 'italic' },
  checklist: { gap: 4 },
  errors: { padding: 10, borderRadius: 8, gap: 4 },
  scholar: { marginTop: 4 },
});

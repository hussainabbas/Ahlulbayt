import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
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

      {showFiqhRefs && step.fiqhRefs?.length
        ? step.fiqhRefs.map((ref, i) => (
            <View
              key={i}
              style={[styles.refBox, { backgroundColor: theme.colors.surfaceMuted }]}
            >
              <Text variant="caption" color="accent">
                {pickLocalized(ref.source, locale)}
              </Text>
              {ref.citation ? (
                <Text variant="caption" color="tertiary">
                  {pickLocalized(ref.citation, locale)}
                </Text>
              ) : null}
            </View>
          ))
        : null}
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
  refBox: { padding: 10, borderRadius: 8, gap: 2 },
  advanced: { marginTop: 4 },
});

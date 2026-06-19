import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { getShadow } from '@/theme/shadows';
import { layout } from '@/theme/layout';

import type { DailyLifeDuaSection } from '../types';

export type DailyLifeDisplayMode = 'stacked' | 'arabic_only' | 'translation_only';
export type DailyLifeTranslationLayer = 'en' | 'ur';

interface DailyLifeSectionBlockProps {
  section: DailyLifeDuaSection;
  displayMode: DailyLifeDisplayMode;
  translationLayer: DailyLifeTranslationLayer;
  fontScale?: number;
}

export function DailyLifeSectionBlock({
  section,
  displayMode,
  translationLayer,
  fontScale = 1,
}: DailyLifeSectionBlockProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const shadow = getShadow('xs', theme.scheme);

  const translation =
    translationLayer === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';
  const showDivider = showArabic && showTranslation && (translation || section.transliteration);

  return (
    <View
      style={[
        styles.block,
        shadow,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: theme.colors.accentGold }]} />

      <View style={styles.inner}>
        {showArabic ? (
          <Text
            style={[
              styles.arabic,
              {
                color: theme.colors.textPrimary,
                fontSize: 26 * fontScale,
                lineHeight: 46 * fontScale,
              },
            ]}
          >
            {section.arabic}
          </Text>
        ) : null}

        {showDivider ? (
          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />
        ) : null}

        {section.transliteration && showTranslation ? (
          <View style={[styles.translitWrap, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text variant="caption" color="tertiary" style={styles.translitLabel}>
              {t('dailyLifeDuas.transliteration')}
            </Text>
            <Text variant="bodySm" color="secondary" style={styles.translit}>
              {section.transliteration}
            </Text>
          </View>
        ) : null}

        {showTranslation && translation ? (
          <Text
            variant="bodyMd"
            color="secondary"
            style={[
              styles.translation,
              translationLayer === 'ur' && styles.urdu,
              { fontSize: 17 * fontScale, lineHeight: 28 * fontScale },
            ]}
          >
            {translation}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  accent: {
    width: 4,
  },
  inner: {
    flex: 1,
    padding: layout.blockGap + 4,
    gap: 12,
  },
  arabic: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  translitWrap: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  translitLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  translit: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  translation: {
    lineHeight: 28,
  },
  urdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

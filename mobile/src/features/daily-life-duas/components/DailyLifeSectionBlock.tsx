import { StyleSheet, View } from 'react-native';

import { SacredText } from '@/components/ui/SacredText';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { getShadow } from '@/theme/shadows';
import { layout } from '@/theme/layout';
import { getSacredTextStyle } from '@/theme/typographySystem';

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
          <SacredText
            role="duaArabic"
            fontScale={fontScale * 1.18}
            style={{
              color: theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            {section.arabic}
          </SacredText>
        ) : null}

        {showDivider ? (
          <View style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]} />
        ) : null}

        {section.transliteration && showTranslation ? (
          <View style={[styles.translitWrap, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text variant="caption" color="tertiary" style={styles.translitLabel}>
              {t('dailyLifeDuas.transliteration')}
            </Text>
            <Text
              variant="bodySm"
              color="secondary"
              style={getSacredTextStyle('transliteration', fontScale)}
            >
              {section.transliteration}
            </Text>
          </View>
        ) : null}

        {showTranslation && translation ? (
          <Text
            variant="bodyMd"
            color="secondary"
            script={translationLayer === 'ur' ? 'urdu' : 'latin'}
            style={getSacredTextStyle('translation', fontScale * 1.06)}
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
});

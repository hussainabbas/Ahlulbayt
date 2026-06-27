import { StyleSheet, View } from 'react-native';

import { SacredText } from '@/components/ui/SacredText';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { getSacredTextStyle } from '@/theme/typographySystem';

import type { ZiyaratDisplayMode, ZiyaratLine, ZiyaratSection, ZiyaratTranslationLayer } from '../types';

interface ZiyaratSectionBlockProps {
  section: ZiyaratSection;
  index: number;
  total: number;
  displayMode: ZiyaratDisplayMode;
  translationLayer: ZiyaratTranslationLayer;
  fontScale?: number;
  focusMode?: boolean;
}

export function ZiyaratSectionBlock({
  section,
  index,
  total,
  displayMode,
  translationLayer,
  fontScale = 1.05,
  focusMode = false,
}: ZiyaratSectionBlockProps) {
  const { t, locale: appLocale } = useLocale();
  const { theme } = useTheme();

  const sectionTitle =
    appLocale === 'ur' ? section.title?.ur : section.title?.en;
  const translation =
    translationLayer === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;
  const instruction =
    appLocale === 'ur'
      ? section.instruction?.ur ?? section.instruction?.en
      : section.instruction?.en;

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';
  const hasLines = (section.lines?.length ?? 0) > 0;
  const showDivider =
    !hasLines &&
    showArabic &&
    showTranslation &&
    (translation || section.transliteration);

  const arabicFontScale = fontScale * (focusMode ? 1.18 : 1.09);

  const renderLine = (line: ZiyaratLine, lineIndex: number, totalLines: number) => {
    const lineTranslation =
      translationLayer === 'ur'
        ? line.translations.ur ?? line.translations.en
        : line.translations.en;

    return (
      <View
        key={`${section.id}-line-${lineIndex}`}
        style={[
          styles.lineBlock,
          lineIndex < totalLines - 1 && styles.lineBlockSpaced,
        ]}
      >
        {showArabic ? (
          <SacredText
            role="duaArabic"
            fontScale={arabicFontScale}
            style={{
              color: section.sacred ? theme.colors.accentGold : theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            {line.arabic}
          </SacredText>
        ) : null}

        {line.transliteration && showTranslation ? (
          <Text
            variant="bodySm"
            color="tertiary"
            style={getSacredTextStyle('transliteration', fontScale * 0.95)}
          >
            {line.transliteration}
          </Text>
        ) : null}

        {showTranslation && lineTranslation ? (
          <Text
            variant="bodyMd"
            color="secondary"
            script={translationLayer === 'ur' ? 'urdu' : 'latin'}
            style={[
              styles.lineTranslation,
              getSacredTextStyle('translation', fontScale * (focusMode ? 1.08 : 1)),
            ]}
          >
            {lineTranslation}
          </Text>
        ) : null}

        {lineIndex < totalLines - 1 ? (
          <View style={[styles.lineDivider, { backgroundColor: theme.colors.borderSubtle }]} />
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor: section.sacred
            ? 'rgba(212, 184, 122, 0.06)'
            : theme.colors.surfaceElevated,
          borderColor: section.sacred ? theme.colors.accentGold : theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          {sectionTitle ? (
            <Text variant="overline" color="accent">
              {sectionTitle}
            </Text>
          ) : null}
          {section.repeatCount ? (
            <View
              style={[
                styles.repeatBadge,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.accentGold,
                },
              ]}
            >
              <Text variant="caption" color="accent">
                {section.repeatCount}×
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="caption" color="tertiary">
          {index + 1}/{total}
        </Text>
      </View>

      {section.sacred ? (
        <View style={[styles.sacredLine, { backgroundColor: theme.colors.accentGold }]} />
      ) : null}

      {instruction ? (
        <Text variant="bodySm" color="secondary" style={styles.instruction}>
          {instruction}
        </Text>
      ) : null}

      {hasLines ? (
        <View style={styles.linesWrap}>
          {section.lines!.map((line, lineIndex) =>
            renderLine(line, lineIndex, section.lines!.length),
          )}
        </View>
      ) : (
        <>
          {showArabic ? (
            <SacredText
              role="duaArabic"
              fontScale={arabicFontScale}
              style={{
                color: section.sacred ? theme.colors.accentGold : theme.colors.textPrimary,
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
                {t('ziyarat.transliteration')}
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
              style={[
                styles.translation,
                getSacredTextStyle('translation', fontScale * (focusMode ? 1.12 : 1)),
              ]}
            >
              {translation}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  repeatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sacredLine: {
    height: 1,
    width: 48,
    opacity: 0.6,
  },
  instruction: {
    fontStyle: 'italic',
    lineHeight: 22,
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
  translation: {
    marginTop: 4,
  },
  linesWrap: {
    gap: 4,
  },
  lineBlock: {
    gap: 8,
    alignItems: 'stretch',
  },
  lineBlockSpaced: {
    paddingBottom: 4,
  },
  lineTranslation: {
    textAlign: 'center',
  },
  lineDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 12,
    opacity: 0.7,
  },
});

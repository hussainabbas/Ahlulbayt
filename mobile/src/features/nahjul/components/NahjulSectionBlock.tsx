import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import type { NahjulDisplayMode, NahjulSection, NahjulTranslationLayer } from '../types';
import { pickNahjulTranslation } from '../utils/pickNahjulTranslation';

interface NahjulSectionBlockProps {
  section: NahjulSection;
  displayMode: NahjulDisplayMode;
  translationLayer: NahjulTranslationLayer;
  fontScale?: number;
  isQuote?: boolean;
}

function pickSectionTitle(
  section: NahjulSection,
  layer: NahjulTranslationLayer,
): string | undefined {
  if (layer === 'ar') return section.title?.ar?.trim() || section.title?.en;
  if (layer === 'ur') return section.title?.ur?.trim() || section.title?.en;
  return section.title?.en;
}

export function NahjulSectionBlock({
  section,
  displayMode,
  translationLayer,
  fontScale = 1,
  isQuote,
}: NahjulSectionBlockProps) {
  const { theme } = useTheme();

  const isCommentary = section.kind === 'commentary';
  const sectionTitle = pickSectionTitle(section, translationLayer);
  const { text: translation } = pickNahjulTranslation(section, translationLayer);

  const showArabic = displayMode !== 'translation_only' && Boolean(section.arabic?.trim());
  const showTranslation = displayMode !== 'arabic_only' && Boolean(translation?.trim());
  const isRtl = translationLayer === 'ur' || translationLayer === 'ar';

  return (
    <View
      style={[
        styles.block,
        isQuote && styles.quoteBlock,
        isCommentary && styles.commentaryBlock,
        {
          backgroundColor: isCommentary
            ? theme.colors.surfaceMuted
            : theme.colors.surfaceElevated,
          borderColor: isQuote
            ? theme.colors.accentPrimary
            : isCommentary
              ? theme.colors.borderSubtle
              : theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {sectionTitle && !isQuote ? (
        <Text variant="overline" color={isCommentary ? 'tertiary' : 'accent'}>
          {sectionTitle}
        </Text>
      ) : null}

      {isCommentary ? (
        <Text variant="caption" color="tertiary">
          Commentary
        </Text>
      ) : null}

      {showArabic ? (
        <Text
          style={[
            styles.arabic,
            isQuote && styles.quoteArabic,
            {
              color: theme.colors.textPrimary,
              fontSize: (isQuote ? 24 : 22) * fontScale,
              lineHeight: (isQuote ? 42 : 40) * fontScale,
            },
          ]}
        >
          {section.arabic}
        </Text>
      ) : null}

      {showTranslation ? (
        <Text
          variant="bodyMd"
          color={isCommentary ? 'tertiary' : 'secondary'}
          style={[
            styles.translation,
            isRtl && styles.rtl,
            isQuote && styles.quoteTranslation,
            isCommentary && styles.commentaryText,
            {
              fontSize: (isCommentary ? 13 : 16) * fontScale,
              lineHeight: (isCommentary ? 22 : 28) * fontScale,
            },
          ]}
        >
          {isQuote ? `"${translation}"` : translation}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 12,
  },
  quoteBlock: {
    borderLeftWidth: 3,
  },
  commentaryBlock: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  quoteArabic: {
    textAlign: 'center',
  },
  translation: {
    marginTop: 4,
  },
  quoteTranslation: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  commentaryText: {
    fontStyle: 'italic',
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

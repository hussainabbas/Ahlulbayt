import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { NahjulDisplayMode, NahjulSection, NahjulTranslationLayer } from '../types';

interface NahjulSectionBlockProps {
  section: NahjulSection;
  displayMode: NahjulDisplayMode;
  translationLayer: NahjulTranslationLayer;
  fontScale?: number;
  isQuote?: boolean;
}

export function NahjulSectionBlock({
  section,
  displayMode,
  translationLayer,
  fontScale = 1,
  isQuote,
}: NahjulSectionBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const sectionTitle = locale === 'ur' ? section.title?.ur : section.title?.en;
  const translation =
    translationLayer === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';

  return (
    <View
      style={[
        styles.block,
        isQuote && styles.quoteBlock,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: isQuote ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {sectionTitle && !isQuote ? (
        <Text variant="overline" color="accent">
          {sectionTitle}
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

      {showTranslation && translation ? (
        <Text
          variant="bodyMd"
          color="secondary"
          style={[
            styles.translation,
            locale === 'ur' && styles.urdu,
            isQuote && styles.quoteTranslation,
            { fontSize: 16 * fontScale, lineHeight: 28 * fontScale },
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
  urdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

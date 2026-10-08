import { StyleSheet, View } from 'react-native';

import { SacredText } from '@/components/ui/SacredText';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { getSacredTextStyle } from '@/theme/typographySystem';

import type { SahifaDisplayMode, SahifaSection, SahifaTranslationLayer } from '../types';

interface SahifaSectionBlockProps {
  section: SahifaSection;
  displayMode: SahifaDisplayMode;
  translationLayer: SahifaTranslationLayer;
  fontScale?: number;
}

export function SahifaSectionBlock({
  section,
  displayMode,
  translationLayer,
  fontScale = 1,
}: SahifaSectionBlockProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  const sectionTitle =
    locale === 'ur' ? section.title?.ur : section.title?.en;
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
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      {sectionTitle ? (
        <Text variant="overline" color="accent" style={styles.sectionTitle}>
          {sectionTitle}
        </Text>
      ) : null}

      {showArabic ? (
        <SacredText
          role="duaArabic"
          fontScale={fontScale}
          style={{ color: theme.colors.textPrimary }}
        >
          {section.arabic}
        </SacredText>
      ) : null}

      {showTranslation && translation ? (
        <Text
          variant="bodyMd"
          color="secondary"
          script={translationLayer === 'ur' ? 'urdu' : 'latin'}
          style={[
            styles.translation,
            getSacredTextStyle('translation', fontScale),
          ]}
        >
          {translation}
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
  sectionTitle: {
    marginBottom: 4,
  },
  translation: {
    marginTop: 4,
  },
});

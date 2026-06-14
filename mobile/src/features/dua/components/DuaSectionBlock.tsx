import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { DuaDisplayMode, DuaSection, DuaTranslationLayer } from '../types';

interface DuaSectionBlockProps {
  section: DuaSection;
  displayMode: DuaDisplayMode;
  translationLayer: DuaTranslationLayer;
  fontScale?: number;
}

export function DuaSectionBlock({
  section,
  displayMode,
  translationLayer,
  fontScale = 1,
}: DuaSectionBlockProps) {
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
        <Text
          style={[
            styles.arabic,
            {
              color: theme.colors.textPrimary,
              fontSize: 22 * fontScale,
              lineHeight: 40 * fontScale,
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
            { fontSize: 16 * fontScale, lineHeight: 28 * fontScale },
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
  arabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  translation: {
    marginTop: 4,
  },
  urdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

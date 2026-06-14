import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { ZiyaratDisplayMode, ZiyaratSection, ZiyaratTranslationLayer } from '../types';

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
  const { theme } = useTheme();
  const { locale: appLocale } = useLocale();

  const sectionTitle =
    appLocale === 'ur' ? section.title?.ur : section.title?.en;
  const translation =
    translationLayer === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';

  const arabicSize = (focusMode ? 26 : 24) * fontScale;
  const arabicLineHeight = (focusMode ? 48 : 44) * fontScale;

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
        {sectionTitle ? (
          <Text variant="overline" color="accent">
            {sectionTitle}
          </Text>
        ) : (
          <View />
        )}
        <Text variant="caption" color="tertiary">
          {index + 1}/{total}
        </Text>
      </View>

      {section.sacred ? (
        <View style={[styles.sacredLine, { backgroundColor: theme.colors.accentGold }]} />
      ) : null}

      {showArabic ? (
        <Text
          style={[
            styles.arabic,
            {
              color: section.sacred ? theme.colors.accentGold : theme.colors.textPrimary,
              fontSize: arabicSize,
              lineHeight: arabicLineHeight,
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
            appLocale === 'ur' && styles.urdu,
            {
              fontSize: (focusMode ? 18 : 16) * fontScale,
              lineHeight: (focusMode ? 32 : 28) * fontScale,
            },
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
  sacredLine: {
    height: 1,
    width: 48,
    opacity: 0.6,
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

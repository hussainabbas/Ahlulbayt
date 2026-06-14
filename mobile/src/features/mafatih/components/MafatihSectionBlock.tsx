import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type {
  MafatihDisplayMode,
  MafatihSection,
  MafatihTranslationLayer,
} from '../types';

interface MafatihSectionBlockProps {
  section: MafatihSection;
  index: number;
  total: number;
  displayMode: MafatihDisplayMode;
  translationLayer: MafatihTranslationLayer;
  fontScale?: number;
  focusMode?: boolean;
}

export function MafatihSectionBlock({
  section,
  index,
  total,
  displayMode,
  translationLayer,
  fontScale = 1.05,
  focusMode = false,
}: MafatihSectionBlockProps) {
  const { locale: appLocale } = useLocale();
  const { theme } = useTheme();

  const sectionTitle = appLocale === 'ur' ? section.title?.ur : section.title?.en;
  const translation =
    translationLayer === 'ur'
      ? section.translations.ur ?? section.translations.en
      : section.translations.en;

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';
  const arabicSize = (focusMode ? 26 : 24) * fontScale;

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
              lineHeight: arabicSize * 1.75,
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

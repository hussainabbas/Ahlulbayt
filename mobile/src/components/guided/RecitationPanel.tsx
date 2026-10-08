import { StyleSheet, View } from 'react-native';

import { SacredText } from '@/components/ui/SacredText';
import { Text } from '@/components/ui/Text';
import type { GuideContentLocale } from '@/components/guided/types';
import type { LocalizedText } from '@/features/prayer-academy/types';
import { pickLocalized } from '@/features/prayer-academy/utils/localizedText';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';
import { getSacredTextStyle } from '@/theme/typographySystem';

interface RecitationPanelProps {
  arabic?: string;
  transliteration?: LocalizedText;
  translation?: LocalizedText;
  showTransliteration?: boolean;
  forceShowArabic?: boolean;
  showArabic?: boolean;
  contentLocale?: GuideContentLocale;
  fontScale?: number;
}

const TRANSLATION_LABEL_KEYS: Record<GuideContentLocale, string> = {
  en: 'guided.reader.langEn',
  ur: 'guided.reader.langUr',
  ar: 'guided.reader.langAr',
};

export function RecitationPanel({
  arabic,
  transliteration,
  translation,
  showTransliteration = true,
  forceShowArabic = false,
  showArabic = true,
  contentLocale = 'en',
  fontScale = 1,
}: RecitationPanelProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const displayArabic = arabic && (forceShowArabic || showArabic);
  const transliterationText = transliteration ? pickLocalized(transliteration, contentLocale) : '';
  const translationText = translation ? pickLocalized(translation, contentLocale) : '';
  const emphasizeArabic = contentLocale === 'ar';

  if (!displayArabic && !translationText && !(showTransliteration && transliterationText)) {
    return null;
  }

  const arabicFontScale = fontScale * (emphasizeArabic ? 1.18 : 0.91);

  return (
    <View style={styles.wrap}>
      {displayArabic ? (
        <SacredText
          role="duaArabic"
          fontScale={arabicFontScale}
          style={{ color: theme.colors.textPrimary }}
        >
          {arabic}
        </SacredText>
      ) : null}

      {showTransliteration && transliterationText ? (
        <View style={styles.section}>
          <Text variant="caption" weight="600" color="accent">
            {t('dailyLifeDuas.transliteration')}
          </Text>
          <Text
            variant="caption"
            color="tertiary"
            style={getSacredTextStyle('transliteration', fontScale)}
          >
            {transliterationText}
          </Text>
        </View>
      ) : null}

      {translationText ? (
        <View style={styles.section}>
          <Text variant="caption" weight="600" color="accent">
            {t(TRANSLATION_LABEL_KEYS[contentLocale])}
          </Text>
          <Text
            variant="bodySm"
            color="secondary"
            script={contentLocale === 'ur' ? 'urdu' : 'latin'}
            style={getSacredTextStyle('translation', fontScale * 0.88)}
          >
            {translationText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const RECITATION_KINDS = new Set([
  'recitation',
  'qunoot',
  'tashahhud',
  'salam',
  'tasbihat',
  'takbir',
  'ruku',
  'sujud',
  'qiyam',
  'fiqh_note',
]);

export function isRecitationKind(kind: string): boolean {
  return RECITATION_KINDS.has(kind);
}

const styles = StyleSheet.create({
  wrap: { gap: layout.listGap, marginTop: 4 },
  section: { gap: 4 },
});

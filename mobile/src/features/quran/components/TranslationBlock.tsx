import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { AyahTranslations, TranslationLayer } from '../types';

interface TranslationBlockProps {
  translations: AyahTranslations;
  layers: TranslationLayer[];
  fontSize?: number;
}

const LAYER_LABEL: Record<TranslationLayer, string> = {
  en: 'quran.layers.en',
  ur: 'quran.layers.ur',
  roman_ur: 'quran.layers.romanUr',
};

export function TranslationBlock({ translations, layers, fontSize = 16 }: TranslationBlockProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      {layers.map((layer) => {
        const text = translations[layer];
        if (!text) return null;
        return (
          <View
            key={layer}
            style={[
              styles.row,
              {
                backgroundColor: theme.colors.backgroundPrimary,
                borderLeftColor: theme.colors.accentPrimaryMuted,
                borderRadius: theme.radius.sm,
              },
            ]}
          >
            <Text variant="overline" color="tertiary">
              {t(LAYER_LABEL[layer])}
            </Text>
            <Text
              variant="bodyMd"
              color="secondary"
              style={[
                styles.text,
                { fontSize, lineHeight: fontSize * 1.55 },
                layer === 'ur' && styles.urdu,
              ]}
            >
              {text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  row: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
  },
  text: {},
  urdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

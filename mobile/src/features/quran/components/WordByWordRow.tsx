import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { getTajweedColor } from '../constants/tajweed';
import type { QuranWord, TranslationLayer } from '../types';

interface WordByWordRowProps {
  words: QuranWord[];
  layers: TranslationLayer[];
  activeWordIndex?: number | null;
  showTajweed?: boolean;
}

export function WordByWordRow({
  words,
  layers,
  activeWordIndex,
  showTajweed = true,
}: WordByWordRowProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.grid}>
      {words.map((word) => {
        const isActive = activeWordIndex === word.index;
        const rule = showTajweed ? (word.tajweed ?? 'default') : 'default';
        return (
          <View
            key={word.index}
            style={[
              styles.chip,
              {
                borderColor: isActive ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                backgroundColor: isActive
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceMuted,
              },
            ]}
          >
            <Text
              style={[
                styles.arabic,
                { color: getTajweedColor(rule, theme.scheme), fontSize: 18 },
              ]}
            >
              {word.arabic}
            </Text>
            {word.transliteration ? (
              <Text variant="caption" color="tertiary">
                {word.transliteration}
              </Text>
            ) : null}
            {layers.map((layer) => {
              const label = word.translation?.[layer];
              if (!label) return null;
              return (
                <Text key={layer} variant="caption" color="secondary">
                  {label}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  arabic: {
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});

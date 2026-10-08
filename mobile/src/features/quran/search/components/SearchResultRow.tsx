import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { SemanticSearchResult } from '../types';

interface SearchResultRowProps {
  result: SemanticSearchResult;
  onPress?: (result: SemanticSearchResult) => void;
}

const MATCH_LABELS: Record<SemanticSearchResult['matchType'], string> = {
  topic: 'quran.search.matchTopic',
  semantic: 'quran.search.matchSemantic',
  keyword: 'quran.search.matchKeyword',
  hybrid: 'quran.search.matchHybrid',
};

export function SearchResultRow({ result, onPress }: SearchResultRowProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => onPress?.(result)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="caption" color="accent">
          {result.surahName} · {result.surah}:{result.ayah}
        </Text>
        <View style={[styles.badge, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="caption" color="accent">
            {Math.round(result.score * 100)}%
          </Text>
        </View>
      </View>

      <Text variant="bodyMd" style={[styles.arabic, { color: theme.colors.textPrimary }]}>
        {result.snippetArabic}
      </Text>

      {result.snippetTranslation ? (
        <Text variant="bodySm" color="secondary" numberOfLines={3}>
          {result.snippetTranslation}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text variant="caption" color="tertiary">
          {t(MATCH_LABELS[result.matchType])}
        </Text>
        {result.matchedTopics.length > 0 ? (
          <Text variant="caption" color="accent">
            {result.matchedTopics.join(' · ')}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 14,
    gap: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  arabic: {
    textAlign: 'right',
    fontSize: 20,
    lineHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
});

import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { HadithAiSummary } from '../engine/summaryEngine';
import { pickLocalized } from '../utils/localize';

interface HadithSummaryCardProps {
  aiSummary: HadithAiSummary;
}

export function HadithSummaryCard({ aiSummary }: HadithSummaryCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: theme.colors.accentPrimary + '44',
          backgroundColor: theme.colors.accentPrimaryMuted,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="caption" color="accent">
          ✨ {t('hadith.summary.aiLabel')}
        </Text>
        <Text variant="caption" color="tertiary">
          {aiSummary.mode === 'bundled' ? t('hadith.summary.curated') : t('hadith.summary.generated')}
        </Text>
      </View>
      <Text variant="bodyMd" style={styles.body}>
        {pickLocalized(aiSummary.summary, locale)}
      </Text>
      {aiSummary.keyThemes.length > 0 ? (
        <View style={styles.themes}>
          {aiSummary.keyThemes.map((topic) => (
            <View
              key={topic}
              style={[styles.chip, { backgroundColor: theme.colors.backgroundPrimary }]}
            >
              <Text variant="caption" color="secondary">
                {t(`hadith.topics.${topic}`)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: { lineHeight: 24 },
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

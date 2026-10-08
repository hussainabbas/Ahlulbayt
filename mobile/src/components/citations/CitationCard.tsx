import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import type { IslamicCitation } from '@/core/citations';
import { formatCitation } from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CitationBadge } from './CitationBadge';

interface CitationCardProps {
  citation: IslamicCitation;
  compact?: boolean;
}

export function CitationCard({ citation, compact }: CitationCardProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  const rows: Array<{ labelKey: string; value: string }> = [];

  if (citation.source) {
    rows.push({ labelKey: 'citations.source', value: citation.source });
  }
  if (citation.volume != null) {
    rows.push({ labelKey: 'citations.volume', value: String(citation.volume) });
  }
  if (citation.page != null) {
    rows.push({ labelKey: 'citations.page', value: String(citation.page) });
  }
  if (citation.hadithNumber) {
    rows.push({ labelKey: 'citations.hadithNumber', value: citation.hadithNumber });
  }
  if (citation.narrator) {
    rows.push({ labelKey: 'citations.narrator', value: citation.narrator });
  }
  if (citation.scholar) {
    rows.push({ labelKey: 'citations.scholar', value: citation.scholar });
  }

  const summary = formatCitation(citation, locale);

  return (
    <Card variant="elevated" padded style={styles.card}>
      <View style={styles.header}>
        <CitationBadge citation={citation} />
        {!citation.verified && summary ? (
          <Text variant="caption" color="tertiary">
            {summary}
          </Text>
        ) : null}
      </View>

      {!compact && rows.length > 0 ? (
        <View style={styles.rows}>
          {rows.map((row) => (
            <View
              key={row.labelKey}
              style={[styles.row, { borderBottomColor: theme.colors.borderSubtle }]}
            >
              <Text variant="caption" color="tertiary">
                {t(row.labelKey)}
              </Text>
              <Text variant="bodySm" color="secondary">
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {citation.note ? (
        <Text variant="caption" color="tertiary" style={styles.note}>
          {citation.note}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: layout.listGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  rows: {
    gap: 2,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  note: {
    marginTop: 4,
    lineHeight: 18,
  },
});

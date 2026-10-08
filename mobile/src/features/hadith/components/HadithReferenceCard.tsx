import { StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import {
  citationsFromHadithReference,
  mergeCitations,
} from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { SOURCE_BY_ID } from '../constants/catalog';
import type { HadithEntry } from '../types';
import { pickLocalized } from '../utils/localize';

interface HadithReferenceCardProps {
  entry: HadithEntry;
}

export function HadithReferenceCard({ entry }: HadithReferenceCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const ref = entry.reference;
  const sourceMeta = SOURCE_BY_ID[entry.source];
  const sourceLabel = t(sourceMeta.nameKey);

  const citations = mergeCitations(
    entry.citations,
    citationsFromHadithReference(ref, sourceLabel, locale),
  );

  return (
    <Card style={styles.card}>
      <Text variant="headingSm" style={styles.title}>
        {t('hadith.reference.title')}
      </Text>

      <CitationList citations={citations} compact />

      {ref.grading ? (
        <View style={[styles.row, { borderBottomColor: theme.colors.borderSubtle }]}>
          <Text variant="caption" color="tertiary" style={styles.label}>
            {t('hadith.reference.grading')}
          </Text>
          <Text variant="bodySm">{pickLocalized(ref.grading, locale)}</Text>
        </View>
      ) : null}

      {entry.isnad?.links?.length ? (
        <View style={styles.section}>
          <Text variant="caption" color="tertiary">
            {t('hadith.reference.isnad')}
          </Text>
          {entry.isnad.links.map((link) => (
            <Text key={link.position} variant="bodySm" style={styles.narrator}>
              {link.position + 1}. {pickLocalized(link.name, locale)}
            </Text>
          ))}
        </View>
      ) : null}

      {ref.narrators?.length ? (
        <View style={styles.section}>
          <Text variant="caption" color="tertiary">
            {t('hadith.reference.narrators')}
          </Text>
          {ref.narrators.map((n, i) => (
            <Text key={i} variant="bodySm" style={styles.narrator}>
              • {pickLocalized(n, locale)}
            </Text>
          ))}
        </View>
      ) : null}

      {ref.chainSummary ? (
        <View style={styles.section}>
          <Text variant="caption" color="tertiary">
            {t('hadith.reference.chain')}
          </Text>
          <Text variant="bodySm" color="secondary">
            {pickLocalized(ref.chainSummary, locale)}
          </Text>
        </View>
      ) : null}

      {ref.alternateRefs?.length ? (
        <View style={styles.section}>
          <Text variant="caption" color="tertiary">
            {t('hadith.reference.alternate')}
          </Text>
          {ref.alternateRefs.map((alt, i) => (
            <Text key={i} variant="bodySm" color="secondary">
              • {pickLocalized(alt, locale)}
            </Text>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4 },
  title: { marginBottom: 8 },
  row: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { marginBottom: 2 },
  section: { marginTop: 12, gap: 4 },
  narrator: { marginLeft: 4 },
});

import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
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

  const rows: Array<{ label: string; value: string }> = [];

  rows.push({ label: t('hadith.reference.source'), value: t(sourceMeta.nameKey) });
  if (ref.volume != null) {
    rows.push({ label: t('hadith.reference.volume'), value: String(ref.volume) });
  }
  if (ref.book) {
    rows.push({ label: t('hadith.reference.book'), value: pickLocalized(ref.book, locale) });
  }
  if (ref.chapter) {
    rows.push({ label: t('hadith.reference.chapter'), value: pickLocalized(ref.chapter, locale) });
  }
  if (ref.hadithNumber) {
    rows.push({ label: t('hadith.reference.number'), value: ref.hadithNumber });
  }
  if (ref.page) {
    rows.push({ label: t('hadith.reference.page'), value: ref.page });
  }
  if (ref.grading) {
    rows.push({ label: t('hadith.reference.grading'), value: pickLocalized(ref.grading, locale) });
  }

  return (
    <Card style={styles.card}>
      <Text variant="headingSm" style={styles.title}>
        {t('hadith.reference.title')}
      </Text>

      {rows.map((row) => (
        <View key={row.label} style={[styles.row, { borderBottomColor: theme.colors.borderSubtle }]}>
          <Text variant="caption" color="tertiary" style={styles.label}>
            {row.label}
          </Text>
          <Text variant="bodySm">{row.value}</Text>
        </View>
      ))}

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

import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';

import { CitationList } from './CitationList';
import type { RamadanAmaalItem } from '../types';

interface AmaalGuideCardProps {
  items: RamadanAmaalItem[];
}

export function AmaalGuideCard({ items }: AmaalGuideCardProps) {
  const { t } = useLocale();

  return (
    <Card variant="elevated" style={styles.card}>
      <Text variant="headingSm">{t('ramadanMode.amaalGuide')}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text variant="bodyMd" weight="600">
            {item.title.en}
          </Text>
          <Text variant="bodySm" color="secondary">
            {item.body.en}
          </Text>
          <CitationList citations={item.citations} compact />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: layout.blockGap },
  item: { gap: layout.listGap },
});

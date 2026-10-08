import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';

import type { MasoomeenBioSection } from '../types';
import { pickLocalized } from '../utils/localize';

interface BiographySectionProps {
  sections: MasoomeenBioSection[];
}

export function BiographySection({ sections }: BiographySectionProps) {
  const { locale } = useLocale();

  return (
    <View style={styles.wrap}>
      {sections.map((section) => (
        <Card key={section.id} style={styles.card}>
          <Text variant="headingSm" style={styles.title}>
            {pickLocalized(section.title, locale)}
          </Text>
          <Text variant="bodyMd" color="secondary" style={styles.body}>
            {pickLocalized(section.body, locale)}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  card: {
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  body: {
    lineHeight: 24,
  },
});

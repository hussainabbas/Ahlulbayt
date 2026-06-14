import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MasoomeenQuote } from '../types';
import { pickLocalized } from '../utils/localize';

interface QuotesSectionProps {
  quotes: MasoomeenQuote[];
}

export function QuotesSection({ quotes }: QuotesSectionProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      {quotes.map((q) => (
        <Card key={q.id} style={styles.card}>
          {q.arabic ? (
            <Text
              variant="bodyLg"
              style={[styles.arabic, { color: theme.colors.accentPrimary }]}
            >
              {q.arabic}
            </Text>
          ) : null}
          <Text variant="bodyMd" style={styles.quote}>
            "{pickLocalized(q.text, locale)}"
          </Text>
          <Text variant="caption" color="tertiary">
            — {pickLocalized(q.source, locale)}
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
    gap: 10,
  },
  arabic: {
    textAlign: 'right',
    lineHeight: 32,
    writingDirection: 'rtl',
  },
  quote: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

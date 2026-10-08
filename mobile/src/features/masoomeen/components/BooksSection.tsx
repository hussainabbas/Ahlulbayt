import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';

import type { MasoomeenBook } from '../types';
import { pickLocalized } from '../utils/localize';

interface BooksSectionProps {
  books: MasoomeenBook[];
}

export function BooksSection({ books }: BooksSectionProps) {
  const { locale } = useLocale();

  return (
    <View style={styles.wrap}>
      {books.map((book) => (
        <Card key={book.id} style={styles.card}>
          <Text variant="headingSm">📖 {pickLocalized(book.title, locale)}</Text>
          <Text variant="bodySm" color="secondary" style={styles.desc}>
            {pickLocalized(book.description, locale)}
          </Text>
          {book.note ? (
            <Text variant="caption" color="accent">
              {pickLocalized(book.note, locale)}
            </Text>
          ) : null}
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
  desc: {
    lineHeight: 20,
  },
});

import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { KarbalaEvent } from '../types';
import { pickLocalizedText } from '../utils/localize';
import { SourceCitationList } from './SourceCitationList';

interface TimelineEventRowProps {
  event: KarbalaEvent;
  isLast?: boolean;
}

export function TimelineEventRow({ event, isLast }: TimelineEventRowProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: theme.colors.accentGold }]} />
        {!isLast ? (
          <View style={[styles.line, { backgroundColor: theme.colors.borderSubtle }]} />
        ) : null}
      </View>
      <Card style={styles.card}>
        <Text variant="overline" color="secondary">
          {event.hijriLabel}
          {event.timeOfDay ? ` · ${event.timeOfDay}` : ''}
        </Text>
        <Text variant="headingSm" style={styles.title}>
          {pickLocalizedText(event.title, locale)}
        </Text>
        <Text variant="bodySm" color="secondary" style={styles.body}>
          {pickLocalizedText(event.narrative, locale)}
        </Text>
        <Text variant="bodySm" color="accent" style={styles.sig}>
          {pickLocalizedText(event.significance, locale)}
        </Text>
        <SourceCitationList citations={event.citations} compact />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rail: {
    width: 16,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 18,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
    minHeight: 40,
  },
  card: {
    flex: 1,
    marginBottom: 12,
  },
  title: {
    marginTop: 4,
  },
  body: {
    marginTop: 8,
    lineHeight: 22,
  },
  sig: {
    marginTop: 8,
    lineHeight: 20,
  },
});

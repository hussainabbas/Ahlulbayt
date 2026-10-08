import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MasoomeenTimelineEntry } from '../types';
import { pickLocalized, timelineKindLabel } from '../utils/localize';

interface TimelineSectionProps {
  entries: MasoomeenTimelineEntry[];
  accentColor: string;
}

export function TimelineSection({ entries, accentColor }: TimelineSectionProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const sorted = [...entries].sort((a, b) => a.hijriYear - b.hijriYear);

  return (
    <View style={styles.wrap}>
      {sorted.map((entry, index) => (
        <View key={entry.id} style={styles.row}>
          <View style={styles.rail}>
            <View style={[styles.dot, { backgroundColor: accentColor }]} />
            {index < sorted.length - 1 ? (
              <View style={[styles.line, { backgroundColor: theme.colors.borderSubtle }]} />
            ) : null}
          </View>
          <View style={[styles.content, { borderColor: theme.colors.borderSubtle }]}>
            <View style={styles.header}>
              <Text variant="caption" color="accent">
                {entry.hijriLabel ?? `${entry.hijriYear} AH`}
              </Text>
              <Text variant="caption" color="tertiary">
                {timelineKindLabel(entry.kind, t)}
              </Text>
            </View>
            <Text variant="headingSm">{pickLocalized(entry.title, locale)}</Text>
            <Text variant="bodySm" color="secondary" style={styles.desc}>
              {pickLocalized(entry.description, locale)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  rail: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 14,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  content: {
    flex: 1,
    borderLeftWidth: 0,
    paddingBottom: 20,
    paddingLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  desc: {
    marginTop: 6,
    lineHeight: 20,
  },
});

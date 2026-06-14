import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';

import type { MasoomeenLinkedEvent } from '../types';
import { pickLocalized } from '../utils/localize';

interface EventsSectionProps {
  events: MasoomeenLinkedEvent[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const { locale, t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.wrap}>
      {events.map((ev) => (
        <Pressable
          key={ev.id}
          onPress={() => navigation.navigate('Calendar')}
          style={({ pressed }) => [pressed && { opacity: 0.85 }]}
        >
          <Card style={styles.card}>
            <View style={styles.header}>
              {ev.hijriMonth > 0 && ev.hijriDay > 0 ? (
                <Text variant="caption" color="accent">
                  {ev.hijriDay}/{ev.hijriMonth}
                </Text>
              ) : (
                <Text variant="caption" color="accent">
                  {t('masoomeen.ongoing')}
                </Text>
              )}
            </View>
            <Text variant="headingSm">{pickLocalized(ev.title, locale)}</Text>
            <Text variant="bodySm" color="secondary" style={styles.desc}>
              {pickLocalized(ev.description, locale)}
            </Text>
            <Text variant="caption" color="tertiary" style={styles.link}>
              {t('masoomeen.viewCalendar')} ›
            </Text>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  card: {
    gap: 6,
  },
  header: {
    marginBottom: 2,
  },
  desc: {
    lineHeight: 20,
  },
  link: {
    marginTop: 4,
  },
});

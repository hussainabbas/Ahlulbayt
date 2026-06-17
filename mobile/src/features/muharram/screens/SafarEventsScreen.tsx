import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { SourceCitationList } from '../components/SourceCitationList';
import { getSafarEvents } from '../engine/muharramRepository';
import { pickLocalizedText } from '../utils/localize';

export function SafarEventsScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const events = useMemo(() => getSafarEvents(), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramModule.hub.safar'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen scroll padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="headingLg">{t('muharramModule.safar.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('muharramModule.safar.subtitle')}
        </Text>
      </View>

      <View style={[styles.list, { paddingHorizontal: theme.spacing[5] }]}>
        {events.map((event) => (
          <Card key={event.id} style={styles.event}>
            <Text variant="overline" color="secondary">
              {t('muharramModule.safar.dayLabel', { day: event.safarDay })}
            </Text>
            <Text variant="headingMd">{pickLocalizedText(event.title, locale)}</Text>
            <Text variant="bodyMd" color="secondary" style={styles.body}>
              {pickLocalizedText(event.narrative, locale)}
            </Text>
            <Text variant="bodySm" color="accent" style={styles.sig}>
              {pickLocalizedText(event.significance, locale)}
            </Text>
            <SourceCitationList citations={event.citations} compact />
            {event.relatedMasoomeenIds?.map((id) => (
              <ListRow
                key={id}
                title={id.replace('masoom_', '').replace(/_/g, ' ')}
                onPress={() => navigation.navigate('MasoomeenProfile', { masoomeenId: id })}
              />
            ))}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    gap: 8,
    marginBottom: 8,
  },
  list: {
    gap: 16,
    paddingBottom: 40,
  },
  event: {
    gap: 8,
  },
  body: {
    lineHeight: 22,
    marginTop: 4,
  },
  sig: {
    lineHeight: 20,
  },
});

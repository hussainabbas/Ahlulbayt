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
import { getArbaeenStages } from '../engine/muharramRepository';
import { pickLocalizedText } from '../utils/localize';

export function ArbaeenJourneyScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const stages = useMemo(() => getArbaeenStages(), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramModule.hub.arbaeen'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen scroll padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="headingLg">{t('muharramModule.arbaeen.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('muharramModule.arbaeen.subtitle')}
        </Text>
      </View>

      <View style={[styles.list, { paddingHorizontal: theme.spacing[5] }]}>
        {stages.map((stage) => (
          <Card key={stage.id} style={styles.stage}>
            <Text variant="overline" color="secondary">
              {t('muharramModule.arbaeen.stage', {
                day: stage.hijriDay,
                month: t('calendar.months.safar'),
              })}
            </Text>
            <Text variant="headingMd">{pickLocalizedText(stage.title, locale)}</Text>
            <Text variant="bodyMd" color="secondary" style={styles.body}>
              {pickLocalizedText(stage.narrative, locale)}
            </Text>
            <Text variant="bodySm" color="accent" style={styles.sig}>
              {pickLocalizedText(stage.significance, locale)}
            </Text>
            <SourceCitationList citations={stage.citations} compact />
            {stage.ziyaratId ? (
              <ListRow
                title={t('muharramMode.openZiyarat')}
                subtitle={stage.ziyaratId.replace('ziyarat_', '')}
                onPress={() =>
                  navigation.navigate('ZiyaratReader', { ziyaratId: stage.ziyaratId! })
                }
              />
            ) : null}
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
  stage: {
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

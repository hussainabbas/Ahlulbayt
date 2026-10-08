import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { SourceCitationList } from '../components/SourceCitationList';
import { getMartyr } from '../engine/muharramRepository';
import { pickLocalizedText } from '../utils/localize';

export function MartyrProfileScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MartyrProfile'>>();
  const martyr = useMemo(() => getMartyr(route.params.martyrId), [route.params.martyrId]);

  useLayoutEffect(() => {
    const title = martyr
      ? `${pickLocalizedText(martyr.name, locale)} ${martyr.honorific ? pickLocalizedText(martyr.honorific, locale) : ''}`
      : t('muharramModule.martyrs.profile');
    navigation.setOptions({
      title: title.trim(),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, martyr, locale, t, theme]);

  if (!martyr) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('muharramModule.martyrs.notFound')}
        </Text>
      </Screen>
    );
  }

  const name = pickLocalizedText(martyr.name, locale);
  const honorific = martyr.honorific ? pickLocalizedText(martyr.honorific, locale) : '';

  return (
    <Screen scroll>
      <Card>
        <Text variant="overline" color="secondary">
          {pickLocalizedText(martyr.role, locale)}
        </Text>
        <Text variant="headingLg" style={styles.name}>
          {name} {honorific}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('muharramModule.martyrs.shahadatDay', { day: martyr.shahadatDay })}
        </Text>
      </Card>

      <Card style={styles.block}>
        <Text variant="headingSm">{t('muharramModule.narrative')}</Text>
        <Text variant="bodyMd" color="secondary" style={styles.body}>
          {pickLocalizedText(martyr.narrative, locale)}
        </Text>
      </Card>

      <Card style={styles.block}>
        <Text variant="headingSm">{t('muharramModule.significance')}</Text>
        <Text variant="bodyMd" color="accent" style={styles.body}>
          {pickLocalizedText(martyr.significance, locale)}
        </Text>
        <SourceCitationList citations={martyr.citations} />
      </Card>

      {martyr.masoomeenId ? (
        <Button
          label={t('muharramModule.martyrs.openMasoomeen')}
          onPress={() =>
            navigation.navigate('MasoomeenProfile', { masoomeenId: martyr.masoomeenId! })
          }
          variant="secondary"
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    marginTop: 4,
  },
  block: {
    marginTop: 16,
    gap: 8,
  },
  body: {
    lineHeight: 24,
    marginTop: 4,
  },
});

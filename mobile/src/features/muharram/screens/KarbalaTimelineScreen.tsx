import { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { TimelineEventRow } from '../components/TimelineEventRow';
import { getKarbalaTimeline } from '../engine/karbalaTimeline';

export function KarbalaTimelineScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const events = useMemo(() => getKarbalaTimeline(), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramModule.hub.karbalaTimeline'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  return (
    <Screen scroll padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="headingLg">{t('muharramModule.timeline.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('muharramModule.timeline.subtitle')}
        </Text>
      </View>
      <View style={[styles.list, { paddingHorizontal: theme.spacing[5] }]}>
        {events.map((event, index) => (
          <TimelineEventRow key={event.id} event={event} isLast={index === events.length - 1} />
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
    paddingBottom: 40,
  },
});

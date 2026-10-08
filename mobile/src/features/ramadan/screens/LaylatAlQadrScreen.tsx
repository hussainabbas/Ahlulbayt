import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { AmaalGuideCard } from '../components/AmaalGuideCard';
import { CitationList } from '../components/CitationList';
import { getAllLaylatNights, getLaylatAlQadrNight } from '../engine/ramadanRepository';
import { useRamadanMode } from '../hooks/useRamadanMode';
import { useRamadanStore } from '../stores/ramadanStore';

export function LaylatAlQadrScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { hijri, currentDay } = useRamadanMode();
  const setSelectedDay = useRamadanStore((s) => s.setSelectedDay);

  const tonight = getLaylatAlQadrNight(hijri.month === 9 ? hijri.day : currentDay);
  const allNights = getAllLaylatNights();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('ramadanMode.laylatTitle'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  const openReader = () => {
    if (tonight?.sahifaId) {
      navigation.navigate('SahifaReader', { sahifaId: tonight.sahifaId });
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayMd">{t('ramadanMode.laylatTitle')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('ramadanMode.laylatIntro')}
        </Text>

        {tonight ? (
          <Card variant="elevated" style={styles.card}>
            <Text variant="headingMd">{tonight.title.en}</Text>
            <Text variant="bodySm" color="secondary">
              {tonight.narrative.en}
            </Text>
            <CitationList citations={tonight.citations} />
            {tonight.sahifaId ? (
              <Pressable onPress={openReader}>
                <Text variant="caption" color="accent">
                  {t('ramadanMode.openReader')} ›
                </Text>
              </Pressable>
            ) : null}
            <AmaalGuideCard items={tonight.amaal} />
          </Card>
        ) : (
          <Text variant="bodyMd" color="secondary">
            {t('ramadanMode.laylatSelect')}
          </Text>
        )}

        <Text variant="headingSm">{t('ramadanMode.laylatAllNights')}</Text>
        {allNights.map((night) => (
          <Pressable
            key={night.ramadanDay}
            onPress={() => {
              setSelectedDay(night.ramadanDay);
              navigation.navigate('RamadanHub');
            }}
            style={[
              styles.nightRow,
              {
                backgroundColor: night.emphasized
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.backgroundSecondary,
                borderColor: theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="bodyMd" weight={night.emphasized ? '600' : '400'}>
              {night.title.en}
            </Text>
            <CitationList citations={night.citations} compact />
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: { gap: 12 },
  nightRow: {
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
});

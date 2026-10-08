import { useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MuharramDayPicker } from '../components/MuharramDayPicker';
import { SourceCitationList } from '../components/SourceCitationList';
import { TimelineEventRow } from '../components/TimelineEventRow';
import {
  clampMuharramDay,
  getKarbalaEvent,
  getMuharramDayEntry,
} from '../engine/muharramRepository';
import type { MuharramDayTab } from '../types';
import { pickLocalizedText } from '../utils/localize';

export function MuharramDayDetailScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MuharramDayDetail'>>();
  const [day, setDay] = useState(clampMuharramDay(route.params.day));
  const [tab, setTab] = useState<MuharramDayTab>('events');

  const entry = useMemo(() => getMuharramDayEntry(day), [day]);
  const karbalaEvents = useMemo(
    () => entry?.karbalaEventIds.map((id) => getKarbalaEvent(id)).filter(Boolean) ?? [],
    [entry],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramModule.dayDetail.title', { day }),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme, day]);

  const tabs = useMemo(
    () => [
      { value: 'events' as const, label: t('muharramModule.tabs.events') },
      { value: 'amaal' as const, label: t('muharramModule.tabs.amaal') },
      { value: 'duas' as const, label: t('muharramModule.tabs.duas') },
      { value: 'ziyarat' as const, label: t('muharramModule.tabs.ziyarat') },
      { value: 'quran' as const, label: t('muharramModule.tabs.quran') },
    ],
    [t],
  );

  if (!entry) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('muharramMode.notAvailable')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen scroll padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <MuharramDayPicker activeDay={day} todayDay={day} onSelect={setDay} />
        <Text variant="headingLg" style={styles.title}>
          {pickLocalizedText(entry.title, locale)}
        </Text>
        <Text variant="bodyMd" color="secondary">
          {pickLocalizedText(entry.narrative, locale)}
        </Text>
        <Text variant="bodySm" color="accent" style={styles.sig}>
          {pickLocalizedText(entry.significance, locale)}
        </Text>
      </View>

      <View style={{ paddingHorizontal: theme.spacing[5] }}>
        <SegmentControl options={tabs} value={tab} onChange={setTab} />
      </View>

      <View style={[styles.tabBody, { paddingHorizontal: theme.spacing[5] }]}>
        {tab === 'events' ? (
          <View style={styles.section}>
            {entry.claims.map((claim) => (
              <Card key={claim.id} style={styles.claimCard}>
                <Text variant="headingSm">{pickLocalizedText(claim.narrative, locale)}</Text>
                <Text variant="bodySm" color="accent" style={styles.claimSig}>
                  {pickLocalizedText(claim.significance, locale)}
                </Text>
                <SourceCitationList citations={claim.citations} />
              </Card>
            ))}
            {karbalaEvents.map((event, index) =>
              event ? (
                <TimelineEventRow
                  key={event.id}
                  event={event}
                  isLast={index === karbalaEvents.length - 1}
                />
              ) : null,
            )}
            {entry.relatedMasoomeenIds && entry.relatedMasoomeenIds.length > 0 ? (
              <Card>
                <Text variant="overline" color="secondary">
                  {t('muharramModule.relatedFigures')}
                </Text>
                {entry.relatedMasoomeenIds.map((id) => (
                  <ListRow
                    key={id}
                    title={id.replace('masoom_', '').replace(/_/g, ' ')}
                    onPress={() => navigation.navigate('MasoomeenProfile', { masoomeenId: id })}
                  />
                ))}
              </Card>
            ) : null}
          </View>
        ) : null}

        {tab === 'amaal' ? (
          <Card>
            <Text variant="headingMd">{pickLocalizedText(entry.worship.amalTitle, locale)}</Text>
            <Text variant="bodyMd" color="secondary" style={styles.block}>
              {pickLocalizedText(entry.worship.amalBody, locale)}
            </Text>
            <Text variant="bodySm" style={styles.steps}>
              {pickLocalizedText(entry.worship.amalSteps, locale)}
            </Text>
            {entry.worship.citations ? (
              <SourceCitationList citations={entry.worship.citations} />
            ) : null}
          </Card>
        ) : null}

        {tab === 'duas' ? (
          <View style={styles.section}>
            {entry.worship.duaIds?.length ? (
              entry.worship.duaIds.map((duaId) => (
                <ListRow
                  key={duaId}
                  title={duaId.replace('dua_', '').replace(/_/g, ' ')}
                  subtitle={t('muharramMode.openDua')}
                  onPress={() => navigation.navigate('DuaReader', { duaId })}
                />
              ))
            ) : (
              <Text variant="bodyMd" color="secondary">
                {t('muharramModule.noDuas')}
              </Text>
            )}
          </View>
        ) : null}

        {tab === 'ziyarat' ? (
          <View style={styles.section}>
            {entry.worship.ziyaratIds.map((ziyaratId) => (
              <ListRow
                key={ziyaratId}
                title={ziyaratId.replace('ziyarat_', '').replace(/_/g, ' ')}
                subtitle={t('muharramMode.openZiyarat')}
                onPress={() => navigation.navigate('ZiyaratReader', { ziyaratId })}
              />
            ))}
          </View>
        ) : null}

        {tab === 'quran' ? (
          <Card>
            {entry.worship.quran ? (
              <>
                <Text variant="headingMd">{t('muharramModule.quran.title')}</Text>
                {entry.worship.quran.note ? (
                  <Text variant="bodyMd" color="secondary" style={styles.block}>
                    {pickLocalizedText(entry.worship.quran.note, locale)}
                  </Text>
                ) : null}
                {entry.worship.quran.surahNumbers.map((surah) => (
                  <Pressable
                    key={surah}
                    onPress={() => navigation.navigate('QuranReader', { surahNumber: surah })}
                    style={({ pressed }) => [
                      styles.surahRow,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderRadius: theme.radius.md,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Text variant="bodyMd">
                      {t('muharramModule.quran.surah', { number: surah })}
                    </Text>
                  </Pressable>
                ))}
                {entry.worship.quran.citations ? (
                  <SourceCitationList citations={entry.worship.quran.citations} />
                ) : null}
              </>
            ) : (
              <Text variant="bodyMd" color="secondary">
                {t('muharramModule.quran.none')}
              </Text>
            )}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    gap: 12,
  },
  title: {
    marginTop: 8,
  },
  sig: {
    lineHeight: 22,
  },
  tabBody: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
    marginTop: 16,
  },
  claimCard: {
    gap: 8,
  },
  claimSig: {
    lineHeight: 20,
  },
  block: {
    marginTop: 8,
    lineHeight: 22,
  },
  steps: {
    marginTop: 12,
    lineHeight: 24,
  },
  surahRow: {
    padding: 14,
    marginTop: 10,
  },
});

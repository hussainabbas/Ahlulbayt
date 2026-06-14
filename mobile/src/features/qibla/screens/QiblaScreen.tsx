import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { QiblaArView } from '../components/QiblaArView';
import { QiblaCalibrationSheet } from '../components/QiblaCalibrationSheet';
import { QiblaCompassDial } from '../components/QiblaCompassDial';
import { QiblaMapView } from '../components/QiblaMapView';
import { QiblaModeTabs } from '../components/QiblaModeTabs';
import { useQibla } from '../hooks/useQibla';
import { useQiblaStore } from '../stores/qiblaStore';
import type { QiblaViewMode } from '../types';

export function QiblaScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const preferredView = useQiblaStore((s) => s.preferredView);
  const setPreferredView = useQiblaStore((s) => s.setPreferredView);
  const [mode, setMode] = useState<QiblaViewMode>(preferredView);
  const [calibrationOpen, setCalibrationOpen] = useState(false);

  const { qibla, compass, cityName, coordinates, isAligned } = useQibla();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('qibla.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerRight: () => (
        <Pressable onPress={() => setCalibrationOpen(true)} hitSlop={8} style={{ marginRight: 12 }}>
          <Text variant="caption" color="accent">
            {t('qibla.calibrate')}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, t, theme]);

  const onModeChange = (m: QiblaViewMode) => {
    setMode(m);
    setPreferredView(m);
  };

  const accuracyLabel =
    compass.accuracy === 'high'
      ? t('qibla.accuracy.high')
      : compass.accuracy === 'medium'
        ? t('qibla.accuracy.medium')
        : compass.accuracy === 'low'
          ? t('qibla.accuracy.low')
          : t('qibla.accuracy.unavailable');

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing[5] }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="displayMd">{t('qibla.title')}</Text>
        <Text variant="bodySm" color="secondary">
          {t('qibla.subtitle')}
        </Text>

        <View style={styles.metaRow}>
          <Text variant="caption" color="tertiary">
            📍 {cityName ?? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`}
          </Text>
          <Text variant="caption" color="tertiary">
            {accuracyLabel}
          </Text>
        </View>

        <QiblaModeTabs active={mode} onChange={onModeChange} />

        <View style={styles.viewArea}>
          {mode === 'compass' ? (
            <QiblaCompassDial
              deviceHeading={compass.calibratedHeading}
              qiblaRelative={compass.qiblaRelative}
              qiblaBearing={compass.qiblaBearing}
              isAligned={isAligned}
            />
          ) : null}

          {mode === 'map' ? (
            <QiblaMapView
              user={coordinates}
              qiblaBearing={qibla.bearing}
              distanceKm={qibla.distanceKm}
            />
          ) : null}

          {mode === 'ar' ? (
            <QiblaArView
              qiblaRelative={compass.qiblaRelative}
              qiblaBearing={qibla.bearing}
              distanceKm={qibla.distanceKm}
              isAligned={isAligned}
            />
          ) : null}
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceMuted }]}>
          <InfoRow label={t('qibla.info.bearing')} value={`${Math.round(qibla.bearing)}°`} />
          <InfoRow label={t('qibla.info.distance')} value={`${Math.round(qibla.distanceKm).toLocaleString()} km`} />
          <InfoRow label={t('qibla.info.heading')} value={`${Math.round(compass.calibratedHeading)}°`} />
          <Text variant="caption" color="tertiary" style={styles.offline}>
            {t('qibla.offline')}
          </Text>
        </View>
      </ScrollView>

      <QiblaCalibrationSheet
        visible={calibrationOpen}
        onClose={() => setCalibrationOpen(false)}
      />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text variant="bodySm" color="secondary">
        {label}
      </Text>
      <Text variant="bodySm" color="primary">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  viewArea: {
    alignItems: 'center',
    minHeight: 380,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offline: {
    marginTop: 4,
    textAlign: 'center',
  },
});

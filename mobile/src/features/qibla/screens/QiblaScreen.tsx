import { useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { QiblaArView } from '../components/QiblaArView';
import { QiblaCalibrationSheet } from '../components/QiblaCalibrationSheet';
import { QiblaCompassDial } from '../components/QiblaCompassDial';
import { QiblaMapView } from '../components/QiblaMapView';
import { useQibla } from '../hooks/useQibla';
import { useQiblaStore } from '../stores/qiblaStore';
import type { QiblaViewMode } from '../types';

export function QiblaScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const preferredView = useQiblaStore((s) => s.preferredView);
  const setPreferredView = useQiblaStore((s) => s.setPreferredView);
  const [mode, setMode] = useState<QiblaViewMode>(preferredView);
  const [calibrationOpen, setCalibrationOpen] = useState(false);

  const { qibla, compass, cityName, coordinates, isAligned } = useQibla();

  const modeOptions = useMemo(
    () => [
      { value: 'compass' as const, label: t('qibla.modes.compass') },
      { value: 'map' as const, label: t('qibla.modes.map') },
      { value: 'ar' as const, label: t('qibla.modes.ar') },
    ],
    [t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('qibla.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
      headerRight: () => (
        <Pressable onPress={() => setCalibrationOpen(true)} hitSlop={8} style={styles.resetBtn}>
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
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <View style={[styles.page, { paddingBottom: insets.bottom + layout.blockGap }]}>
        <View style={styles.header}>
          <Text variant="bodySm" color="secondary" style={styles.subtitle}>
            {t('qibla.subtitle')}
          </Text>

          <Card variant="inset" style={styles.metaCard}>
            <Text variant="caption" color="secondary">
              📍 {cityName ?? `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`}
            </Text>
            <Text variant="caption" color="tertiary">
              {accuracyLabel}
            </Text>
          </Card>

          <SegmentControl options={modeOptions} value={mode} onChange={onModeChange} />
        </View>

        <View style={[styles.stage, mode === 'ar' && styles.stageAr]}>
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
              active={mode === 'ar'}
              qiblaRelative={compass.qiblaRelative}
              qiblaBearing={qibla.bearing}
              distanceKm={qibla.distanceKm}
              isAligned={isAligned}
            />
          ) : null}
        </View>

        {mode !== 'ar' ? (
          <Card variant="inset" style={styles.infoCard}>
            <InfoRow label={t('qibla.info.bearing')} value={`${Math.round(qibla.bearing)}°`} />
            <InfoRow label={t('qibla.info.distance')} value={`${Math.round(qibla.distanceKm).toLocaleString()} km`} />
            <InfoRow label={t('qibla.info.heading')} value={`${Math.round(compass.calibratedHeading)}°`} />
            <Text variant="caption" color="tertiary" style={styles.offline}>
              {t('qibla.offline')}
            </Text>
          </Card>
        ) : null}
      </View>

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
      <Text variant="bodySm" weight="600">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    gap: layout.sectionGap,
  },
  header: {
    gap: layout.blockGap,
  },
  subtitle: {
    maxWidth: '92%',
  },
  metaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: layout.blockGap,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 360,
  },
  stageAr: {
    minHeight: 420,
  },
  infoCard: {
    gap: layout.blockGap,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offline: {
    marginTop: layout.listGap,
    textAlign: 'center',
  },
  resetBtn: {
    marginRight: layout.listGap,
  },
});

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { KAABA } from '../constants/kaaba';
import { projectEquirectangular } from '../engine/qiblaCalculator';
import type { QiblaCoordinates } from '../types';

interface QiblaMapViewProps {
  user: QiblaCoordinates;
  qiblaBearing: number;
  distanceKm: number;
}

export function QiblaMapView({ user, qiblaBearing, distanceKm }: QiblaMapViewProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  const userPt = projectEquirectangular(user.latitude, user.longitude);
  const kaabaPt = projectEquirectangular(KAABA.latitude, KAABA.longitude);

  const mapW = 320;
  const mapH = 160;
  const ux = userPt.x * mapW;
  const uy = userPt.y * mapH;
  const kx = kaabaPt.x * mapW;
  const ky = kaabaPt.y * mapH;

  const lineAngle =
    (Math.atan2(ky - uy, kx - ux) * 180) / Math.PI;
  const lineLen = Math.sqrt((kx - ux) ** 2 + (ky - uy) ** 2);

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.map,
          {
            width: mapW,
            height: mapH,
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <View style={[styles.gridH, { backgroundColor: theme.colors.borderSubtle }]} />
        <View style={[styles.gridV, { backgroundColor: theme.colors.borderSubtle }]} />

        <View
          style={[
            styles.line,
            {
              left: ux,
              top: uy,
              width: lineLen,
              backgroundColor: theme.colors.accentPrimary,
              transform: [{ rotate: `${lineAngle}deg` }],
            },
          ]}
        />

        <View style={[styles.marker, { left: ux - 6, top: uy - 6, backgroundColor: theme.colors.accentPrimary }]} />
        <View style={[styles.marker, styles.kaaba, { left: kx - 7, top: ky - 7, backgroundColor: '#D4B87A' }]} />

        <Text variant="caption" color="tertiary" style={[styles.label, { left: ux + 8, top: uy - 8 }]}>
          {t('qibla.map.you')}
        </Text>
        <Text variant="caption" color="accent" style={[styles.label, { left: kx + 8, top: ky - 8 }]}>
          🕋
        </Text>
      </View>

      <View style={styles.legend}>
        <Text variant="bodySm" color="secondary">
          {t('qibla.map.bearing', { degrees: Math.round(qiblaBearing) })}
        </Text>
        <Text variant="bodySm" color="secondary">
          {t('qibla.map.distance', { km: Math.round(distanceKm) })}
        </Text>
        <Text variant="caption" color="tertiary">
          {t('qibla.offline')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: 16 },
  map: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    opacity: 0.4,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    opacity: 0.4,
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
    opacity: 0.85,
  },
  marker: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  kaaba: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  label: {
    position: 'absolute',
  },
  legend: {
    alignItems: 'center',
    gap: 4,
  },
});

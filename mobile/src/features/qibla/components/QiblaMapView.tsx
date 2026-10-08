import { StyleSheet, useWindowDimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { KAABA } from '../constants/kaaba';
import { greatCirclePoints, projectEquirectangular } from '../engine/qiblaCalculator';
import type { QiblaCoordinates } from '../types';

interface QiblaMapViewProps {
  user: QiblaCoordinates;
  qiblaBearing: number;
  distanceKm: number;
}

export function QiblaMapView({ user, qiblaBearing, distanceKm }: QiblaMapViewProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const mapW = Math.min(screenWidth - layout.screenPaddingX * 2, 360);
  const mapH = Math.round(mapW * 0.56);

  const userPt = projectEquirectangular(user.latitude, user.longitude);
  const kaabaPt = projectEquirectangular(KAABA.latitude, KAABA.longitude);
  const ux = userPt.x * mapW;
  const uy = userPt.y * mapH;
  const kx = kaabaPt.x * mapW;
  const ky = kaabaPt.y * mapH;

  const arcPoints = greatCirclePoints(user, KAABA, 28).map((point) => {
    const projected = projectEquirectangular(point.latitude, point.longitude);
    return { x: projected.x * mapW, y: projected.y * mapH };
  });

  return (
    <View style={styles.root}>
      <Card padded={false} style={styles.mapCard}>
        <LinearGradient
          colors={[theme.colors.surfaceMuted, theme.colors.backgroundSecondary, theme.colors.surfaceMuted]}
          style={[styles.map, { width: mapW, height: mapH }]}
        >
          <View style={[styles.gridH, { backgroundColor: theme.colors.borderSubtle }]} />
          <View style={[styles.gridV, { backgroundColor: theme.colors.borderSubtle }]} />

          {arcPoints.map((point, index) => (
            <View
              key={`arc-${index}`}
              style={[
                styles.arcDot,
                {
                  left: point.x - 2,
                  top: point.y - 2,
                  backgroundColor:
                    index === arcPoints.length - 1
                      ? theme.colors.accentGold
                      : theme.colors.accentPrimary,
                  opacity: 0.35 + (index / arcPoints.length) * 0.55,
                },
              ]}
            />
          ))}

          <View
            style={[
              styles.bearingFan,
              {
                left: ux - 28,
                top: uy - 28,
                borderColor: theme.colors.accentPrimaryMuted,
                transform: [{ rotate: `${qiblaBearing - 22.5}deg` }],
              },
            ]}
          />

          <View style={[styles.userMarker, { left: ux - 10, top: uy - 10 }]}>
            <View style={[styles.userCore, { backgroundColor: theme.colors.accentPrimary }]} />
            <View style={[styles.userRing, { borderColor: theme.colors.accentPrimary }]} />
          </View>

          <View style={[styles.kaabaMarker, { left: kx - 12, top: ky - 12 }]}>
            <Text variant="caption">🕋</Text>
          </View>

          <View
            style={[
              styles.mapLabel,
              {
                left: Math.min(ux + 12, mapW - 56),
                top: uy - 10,
                backgroundColor: theme.colors.surfaceElevated,
              },
            ]}
          >
            <Text variant="caption" color="primary">
              {t('qibla.map.you')}
            </Text>
          </View>
        </LinearGradient>

        <View style={[styles.mapFooter, { borderTopColor: theme.colors.borderSubtle }]}>
          <MapStat label={t('qibla.info.bearing')} value={`${Math.round(qiblaBearing)}°`} />
          <View style={[styles.footerDivider, { backgroundColor: theme.colors.borderSubtle }]} />
          <MapStat label={t('qibla.info.distance')} value={`${Math.round(distanceKm).toLocaleString()} km`} />
        </View>
      </Card>

      <Text variant="caption" color="tertiary" style={styles.hint}>
        {t('qibla.map.hint')}
      </Text>
    </View>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" color="tertiary">
        {label}
      </Text>
      <Text variant="bodySm" weight="600">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    gap: layout.blockGap,
  },
  mapCard: {
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    overflow: 'hidden',
    position: 'relative',
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: StyleSheet.hairlineWidth,
    opacity: 0.35,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: StyleSheet.hairlineWidth,
    opacity: 0.35,
  },
  arcDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  bearingFan: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 14,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    opacity: 0.45,
  },
  userMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  userRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    opacity: 0.45,
  },
  kaabaMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabel: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.blockGap,
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: layout.blockGap,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  hint: {
    textAlign: 'center',
    paddingHorizontal: layout.blockGap,
  },
});

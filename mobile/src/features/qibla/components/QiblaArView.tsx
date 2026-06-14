import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { requestCameraPermission } from '@/core/native/camera';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface QiblaArViewProps {
  active: boolean;
  qiblaRelative: number;
  qiblaBearing: number;
  distanceKm: number;
  isAligned: boolean;
}

export function QiblaArView({
  active,
  qiblaRelative,
  qiblaBearing,
  distanceKm,
  isAligned,
}: QiblaArViewProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (active && !hasPermission) {
      void requestCameraPermission().then((granted) => {
        if (!granted) void requestPermission();
      });
    }
  }, [active, hasPermission, requestPermission]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${qiblaRelative}deg`, { damping: 16, stiffness: 100 }) }],
  }));

  if (!hasPermission) {
    return (
      <View style={[styles.permissionCard, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Text variant="headingSm">{t('qibla.ar.cameraRequired')}</Text>
        <Text variant="bodySm" color="secondary" style={styles.permissionCopy}>
          {t('qibla.ar.cameraRequiredHint')}
        </Text>
        <Button label={t('qibla.ar.enableCamera')} onPress={() => void requestCameraPermission()} />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.permissionCard, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Text variant="bodySm" color="secondary">
          {t('qibla.ar.cameraUnavailable')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active && hasPermission}
        photo={false}
        video={false}
        audio={false}
      />

      <LinearGradient
        colors={['rgba(8,12,18,0.72)', 'rgba(8,12,18,0.08)', 'rgba(8,12,18,0.78)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.hudTop}>
        <Text variant="overline" style={styles.hudLight}>
          {t('qibla.ar.hud')}
        </Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isAligned
                ? 'rgba(61,155,138,0.28)'
                : 'rgba(255,255,255,0.12)',
              borderColor: isAligned ? theme.colors.accentPrimary : 'rgba(255,255,255,0.18)',
            },
          ]}
        >
          <Text variant="caption" style={{ color: isAligned ? theme.colors.accentPrimary : '#E8ECEA' }}>
            {isAligned ? t('qibla.aligned') : t('qibla.ar.rotate')}
          </Text>
        </View>
      </View>

      <View style={styles.reticle}>
        <View style={[styles.reticleRing, { borderColor: 'rgba(255,255,255,0.22)' }]} />
        <View style={[styles.reticleCrossH, { backgroundColor: 'rgba(255,255,255,0.18)' }]} />
        <View style={[styles.reticleCrossV, { backgroundColor: 'rgba(255,255,255,0.18)' }]} />
      </View>

      <Animated.View style={[styles.arrowWrap, arrowStyle]}>
        <View
          style={[
            styles.arrow,
            {
              borderBottomColor: isAligned ? theme.colors.accentPrimary : theme.colors.accentGold,
            },
          ]}
        />
        <View style={[styles.arrowStem, { backgroundColor: isAligned ? theme.colors.accentPrimary : theme.colors.accentGold }]} />
        <Text variant="bodySm" style={styles.arrowLabel}>
          🕋 {Math.round(qiblaBearing)}°
        </Text>
      </Animated.View>

      <View style={[styles.hudBottom, { borderColor: 'rgba(255,255,255,0.16)' }]}>
        <HudStat label={t('qibla.ar.bearing')} value={`${Math.round(qiblaBearing)}°`} />
        <HudStat label={t('qibla.ar.distance')} value={`${Math.round(distanceKm)} km`} />
        <HudStat
          label={t('qibla.ar.offset')}
          value={`${Math.round(Math.abs(((qiblaRelative + 180) % 360) - 180))}°`}
        />
      </View>

      <Text variant="caption" style={styles.note}>
        {t('qibla.ar.note')}
      </Text>
    </View>
  );
}

function HudStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" style={styles.statLabel}>
        {label}
      </Text>
      <Text variant="bodySm" weight="600" style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 420,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionCard: {
    flex: 1,
    minHeight: 320,
    borderRadius: 18,
    padding: layout.screenPaddingX,
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.blockGap,
  },
  permissionCopy: {
    textAlign: 'center',
  },
  hudTop: {
    position: 'absolute',
    top: layout.screenPaddingX,
    left: layout.screenPaddingX,
    right: layout.screenPaddingX,
    alignItems: 'center',
    gap: layout.listGap,
  },
  hudLight: {
    color: '#E8ECEA',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  reticle: {
    position: 'absolute',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
  },
  reticleCrossH: {
    position: 'absolute',
    width: 220,
    height: 1,
  },
  reticleCrossV: {
    position: 'absolute',
    width: 1,
    height: 220,
  },
  arrowWrap: {
    position: 'absolute',
    alignItems: 'center',
    height: 150,
    justifyContent: 'flex-start',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 48,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowStem: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginTop: -2,
  },
  arrowLabel: {
    marginTop: 8,
    color: '#F5F7F6',
  },
  hudBottom: {
    position: 'absolute',
    bottom: 56,
    left: layout.screenPaddingX,
    right: layout.screenPaddingX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.blockGap,
    paddingHorizontal: layout.blockGap,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(8,12,18,0.35)',
    borderRadius: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    color: 'rgba(232,236,234,0.72)',
  },
  statValue: {
    color: '#F5F7F6',
  },
  note: {
    position: 'absolute',
    bottom: layout.blockGap,
    textAlign: 'center',
    paddingHorizontal: layout.screenPaddingX,
    color: 'rgba(232,236,234,0.72)',
  },
});

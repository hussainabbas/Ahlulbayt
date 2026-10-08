import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  type CameraRuntimeError,
} from 'react-native-vision-camera';

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
  height?: number;
  style?: ViewStyle;
}

export function QiblaArView({
  active,
  qiblaRelative,
  qiblaBearing,
  distanceKm,
  isAligned,
  height,
  style,
}: QiblaArViewProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const panelWidth = windowWidth - layout.screenPaddingX * 2;
  const panelHeight = height ?? 440;

  const requestAccess = useCallback(async () => {
    setPermissionRequested(true);
    const granted = await requestCameraPermission();
    if (!granted) {
      await requestPermission();
    }
  }, [requestPermission]);

  useEffect(() => {
    if (active && !hasPermission && !permissionRequested) {
      void requestAccess();
    }
  }, [active, hasPermission, permissionRequested, requestAccess]);

  useEffect(() => {
    if (active) {
      setCameraError(null);
    }
  }, [active, device?.id]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${qiblaRelative}deg`, { damping: 16, stiffness: 100 }) }],
  }));

  const onCameraError = useCallback((error: CameraRuntimeError) => {
    setCameraError(error.message);
  }, []);

  if (!hasPermission) {
    return (
      <View
        style={[
          styles.panel,
          styles.permissionCard,
          { width: panelWidth, height: panelHeight, backgroundColor: theme.colors.surfaceMuted },
          style,
        ]}
      >
        <Text variant="headingSm">{t('qibla.ar.cameraRequired')}</Text>
        <Text variant="bodySm" color="secondary" style={styles.permissionCopy}>
          {t('qibla.ar.cameraRequiredHint')}
        </Text>
        <Button label={t('qibla.ar.enableCamera')} onPress={() => void requestAccess()} />
      </View>
    );
  }

  const useFallback = !device || cameraError != null;

  return (
    <View
      style={[
        styles.panel,
        styles.root,
        { width: panelWidth, height: panelHeight },
        style,
      ]}
    >
      {!useFallback ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={active && hasPermission}
          preview
          onError={onCameraError}
        />
      ) : (
        <LinearGradient
          colors={['#102018', '#0C0D0F', '#121820']}
          style={StyleSheet.absoluteFill}
        />
      )}

      <LinearGradient
        colors={['rgba(8,12,18,0.72)', 'rgba(8,12,18,0.08)', 'rgba(8,12,18,0.78)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.hudTop}>
        <Text variant="overline" style={styles.hudLight}>
          {t('qibla.ar.hud')}
        </Text>
        {useFallback ? (
          <Text variant="caption" style={styles.fallbackNote}>
            {cameraError ? t('qibla.ar.cameraError') : t('qibla.ar.cameraUnavailable')}
          </Text>
        ) : null}
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
        <View
          style={[
            styles.arrowStem,
            {
              backgroundColor: isAligned ? theme.colors.accentPrimary : theme.colors.accentGold,
            },
          ]}
        />
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
  panel: {
    alignSelf: 'stretch',
    borderRadius: 18,
    overflow: 'hidden',
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionCard: {
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
    top: layout.blockGap,
    left: layout.blockGap,
    right: layout.blockGap,
    alignItems: 'center',
    gap: layout.listGap,
    zIndex: 2,
  },
  hudLight: {
    color: '#E8ECEA',
  },
  fallbackNote: {
    color: 'rgba(232,236,234,0.82)',
    textAlign: 'center',
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
    zIndex: 2,
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
    zIndex: 2,
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
    left: layout.blockGap,
    right: layout.blockGap,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: layout.blockGap,
    paddingHorizontal: layout.blockGap,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(8,12,18,0.35)',
    borderRadius: 14,
    zIndex: 2,
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
    paddingHorizontal: layout.blockGap,
    color: 'rgba(232,236,234,0.72)',
    zIndex: 2,
  },
});

import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

interface QiblaCompassDialProps {
  deviceHeading: number;
  qiblaRelative: number;
  qiblaBearing: number;
  isAligned: boolean;
  size?: number;
}

const CARDINALS = [
  { label: 'N', angle: 0 },
  { label: 'E', angle: 90 },
  { label: 'S', angle: 180 },
  { label: 'W', angle: 270 },
] as const;

export function QiblaCompassDial({
  deviceHeading,
  qiblaRelative,
  qiblaBearing,
  isAligned,
  size = 300,
}: QiblaCompassDialProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const radius = size / 2;

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${-deviceHeading}deg`, { damping: 22, stiffness: 90 }) }],
  }));

  const qiblaNeedleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${qiblaRelative}deg`, { damping: 18, stiffness: 100 }) }],
  }));

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.bezel,
          getShadow('md', theme.scheme),
          {
            width: size + 24,
            height: size + 24,
            borderRadius: (size + 24) / 2,
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: isAligned ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          },
        ]}
      >
        {isAligned ? (
          <View
            style={[
              styles.alignGlow,
              {
                width: size + 12,
                height: size + 12,
                borderRadius: (size + 12) / 2,
                borderColor: theme.colors.accentPrimary,
              },
            ]}
          />
        ) : null}

        <Animated.View
          style={[
            styles.dial,
            dialStyle,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          {Array.from({ length: 36 }, (_, index) => {
            const angle = index * 10;
            const major = angle % 30 === 0;
            return (
              <View
                key={angle}
                style={[
                  styles.tickWrap,
                  { transform: [{ rotate: `${angle}deg` }] },
                ]}
              >
                <View
                  style={[
                    styles.tick,
                    {
                      height: major ? 14 : 8,
                      backgroundColor: major
                        ? theme.colors.textTertiary
                        : theme.colors.borderStrong,
                    },
                  ]}
                />
              </View>
            );
          })}

          {CARDINALS.map(({ label, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const labelRadius = radius - 34;
            const x = radius + labelRadius * Math.sin(rad) - 8;
            const y = radius - labelRadius * Math.cos(rad) - 10;
            return (
              <View
                key={label}
                style={[
                  styles.cardinalPill,
                  {
                    left: x,
                    top: y,
                    backgroundColor:
                      label === 'N' ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
                    borderColor:
                      label === 'N' ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text variant="caption" weight="600" color={label === 'N' ? 'accent' : 'secondary'}>
                  {label}
                </Text>
              </View>
            );
          })}

          <View
            style={[
              styles.innerRing,
              { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceElevated },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.qiblaArm, qiblaNeedleStyle, { height: radius * 0.72 }]}>
          <View
            style={[
              styles.qiblaHead,
              {
                borderBottomColor: isAligned ? theme.colors.accentPrimary : theme.colors.accentGold,
              },
            ]}
          />
          <View
            style={[
              styles.qiblaShaft,
              {
                backgroundColor: isAligned
                  ? theme.colors.accentPrimary
                  : theme.colors.accentGold,
              },
            ]}
          />
        </Animated.View>

        <View
          style={[
            styles.centerHub,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.accentPrimary,
            },
          ]}
        >
          <Text variant="caption" color="accent">
            🕋
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: isAligned
              ? theme.colors.accentPrimaryMuted
              : theme.colors.surfaceMuted,
            borderColor: isAligned ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          },
        ]}
      >
        <Text variant="bodySm" weight="600" color={isAligned ? 'accent' : 'primary'}>
          {isAligned ? t('qibla.aligned') : t('qibla.compass.turn', { degrees: Math.round(Math.abs(((qiblaRelative + 180) % 360) - 180)) })}
        </Text>
        <Text variant="caption" color="secondary">
          {t('qibla.compass.bearing', { degrees: Math.round(qiblaBearing) })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 16,
  },
  bezel: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  alignGlow: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.35,
  },
  dial: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  tick: {
    width: 2,
    marginTop: 10,
    borderRadius: 1,
  },
  cardinalPill: {
    position: 'absolute',
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  innerRing: {
    position: 'absolute',
    width: '58%',
    height: '58%',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  qiblaArm: {
    position: 'absolute',
    width: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  qiblaHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  qiblaShaft: {
    width: 4,
    flex: 1,
    borderRadius: 2,
  },
  centerHub: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 220,
  },
});

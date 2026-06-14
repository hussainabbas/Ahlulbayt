import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface QiblaCompassDialProps {
  deviceHeading: number;
  qiblaRelative: number;
  qiblaBearing: number;
  isAligned: boolean;
  size?: number;
}

export function QiblaCompassDial({
  deviceHeading,
  qiblaRelative,
  qiblaBearing,
  isAligned,
  size = 280,
}: QiblaCompassDialProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${-deviceHeading}deg`, { damping: 20 }) }],
  }));

  const qiblaNeedleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${qiblaRelative}deg`, { damping: 18 }) }],
  }));

  const labels = ['N', 'E', 'S', 'W'];

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.dial,
          dialStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.colors.borderSubtle,
            backgroundColor: theme.colors.surfaceElevated,
          },
        ]}
      >
        {labels.map((label, i) => {
          const angle = i * 90;
          const rad = (angle * Math.PI) / 180;
          const r = size / 2 - 28;
          const x = size / 2 + r * Math.sin(rad) - 8;
          const y = size / 2 - r * Math.cos(rad) - 10;
          return (
            <Text
              key={label}
              variant="caption"
              color={label === 'N' ? 'accent' : 'tertiary'}
              style={{ position: 'absolute', left: x, top: y }}
            >
              {label}
            </Text>
          );
        })}

        <View style={[styles.tickRing, { borderColor: theme.colors.borderSubtle }]} />
      </Animated.View>

      <Animated.View style={[styles.qiblaNeedle, qiblaNeedleStyle, { height: size * 0.38 }]}>
        <View
          style={[
            styles.needleHead,
            {
              borderBottomColor: isAligned ? theme.colors.accentPrimary : '#D4B87A',
            },
          ]}
        />
        <View
          style={[
            styles.needleTail,
            { backgroundColor: theme.colors.textTertiary },
          ]}
        />
      </Animated.View>

      <View style={[styles.centerDot, { backgroundColor: theme.colors.accentPrimary }]} />

      <View style={styles.meta}>
        <Text variant="caption" color="accent">
          🕋 {Math.round(qiblaBearing)}°
        </Text>
        {isAligned ? (
          <Text variant="caption" color="accent">
            {t('qibla.aligned')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dial: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickRing: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  qiblaNeedle: {
    position: 'absolute',
    width: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  needleHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needleTail: {
    width: 4,
    flex: 1,
    borderRadius: 2,
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  meta: {
    position: 'absolute',
    bottom: -28,
    alignItems: 'center',
    gap: 4,
  },
});

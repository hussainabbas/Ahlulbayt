import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface QiblaArViewProps {
  qiblaRelative: number;
  qiblaBearing: number;
  distanceKm: number;
  isAligned: boolean;
}

export function QiblaArView({
  qiblaRelative,
  qiblaBearing,
  distanceKm,
  isAligned,
}: QiblaArViewProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withSpring(`${qiblaRelative}deg`, { damping: 16 }) }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a1628', '#0C0D0F', '#0C0D0F']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.hudTop}>
        <Text variant="caption" color="secondary">
          {t('qibla.ar.hud')}
        </Text>
        <Text variant="caption" color={isAligned ? 'accent' : 'tertiary'}>
          {isAligned ? t('qibla.aligned') : t('qibla.ar.rotate')}
        </Text>
      </View>

      <View style={styles.horizon}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.tick,
              {
                transform: [{ rotate: `${i * 30}deg` }],
                backgroundColor: theme.colors.borderSubtle,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.arrowWrap, arrowStyle]}>
        <View
          style={[
            styles.arrow,
            {
              borderBottomColor: isAligned ? theme.colors.accentPrimary : '#D4B87A',
            },
          ]}
        />
        <Text variant="caption" color="accent" style={styles.arrowLabel}>
          🕋
        </Text>
      </Animated.View>

      <View style={[styles.hudBottom, { borderColor: theme.colors.borderSubtle }]}>
        <HudStat label={t('qibla.ar.bearing')} value={`${Math.round(qiblaBearing)}°`} />
        <HudStat label={t('qibla.ar.distance')} value={`${Math.round(distanceKm)} km`} />
        <HudStat label={t('qibla.ar.offset')} value={`${Math.round(qiblaRelative)}°`} />
      </View>

      <Text variant="caption" color="tertiary" style={styles.note}>
        {t('qibla.ar.note')}
      </Text>
    </View>
  );
}

function HudStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" color="tertiary">
        {label}
      </Text>
      <Text variant="bodySm" color="primary">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 360,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudTop: {
    position: 'absolute',
    top: 16,
    alignItems: 'center',
    gap: 4,
  },
  horizon: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(61,155,138,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    width: 2,
    height: 12,
    top: 8,
  },
  arrowWrap: {
    position: 'absolute',
    alignItems: 'center',
    height: 120,
    justifyContent: 'flex-start',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 56,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowLabel: {
    marginTop: 4,
  },
  hudBottom: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    gap: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  note: {
    position: 'absolute',
    bottom: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

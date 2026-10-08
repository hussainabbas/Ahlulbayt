import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface QiblaCompassMiniProps {
  bearing: number;
  size?: number;
}

/** Static mini dial — shows Qibla bearing without live magnetometer (home widget). */
export function QiblaCompassMini({ bearing, size = 88 }: QiblaCompassMiniProps) {
  const { theme } = useTheme();
  const radius = size / 2;

  return (
    <View
      style={[
        styles.bezel,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme.colors.backgroundSecondary,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text
        variant="caption"
        weight="600"
        color="accent"
        style={[styles.north, { top: 6 }]}
      >
        N
      </Text>

      <View
        style={[
          styles.needleWrap,
          { transform: [{ rotate: `${bearing}deg` }] },
        ]}
      >
        <View
          style={[
            styles.needleHead,
            { borderBottomColor: theme.colors.accentGold },
          ]}
        />
        <View style={[styles.needleShaft, { backgroundColor: theme.colors.accentGold }]} />
      </View>

      <View
        style={[
          styles.hub,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.accentPrimary,
          },
        ]}
      >
        <Text variant="caption">🕋</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bezel: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  north: {
    position: 'absolute',
    alignSelf: 'center',
  },
  needleWrap: {
    position: 'absolute',
    width: 4,
    height: '38%',
    alignItems: 'center',
    top: '12%',
  },
  needleHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needleShaft: {
    width: 3,
    flex: 1,
    borderRadius: 2,
  },
  hub: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet, View, type ViewStyle } from 'react-native';

export type TabIconName = 'home' | 'prayer' | 'quran' | 'ai' | 'profile';

interface TabGlyphProps {
  name: TabIconName;
  color: string;
  size?: number;
  focused?: boolean;
  style?: ViewStyle;
}

const STROKE = 1.75;

export function TabGlyph({ name, color, size = 24, focused = false, style }: TabGlyphProps) {
  const s = size;
  const inner = s * 0.72;

  if (name === 'home') {
    return (
      <View style={[styles.box, { width: s, height: s }, style]}>
        <View
          style={[
            styles.roof,
            {
              width: inner * 0.95,
              height: inner * 0.45,
              borderColor: color,
              borderTopWidth: STROKE,
              borderLeftWidth: STROKE,
              borderRightWidth: STROKE,
            },
          ]}
        />
        <View
          style={[
            styles.homeBody,
            {
              width: inner * 0.78,
              height: inner * 0.52,
              borderColor: color,
              borderWidth: STROKE,
              backgroundColor: focused ? `${color}18` : 'transparent',
            },
          ]}
        />
      </View>
    );
  }

  if (name === 'prayer') {
    return (
      <View style={[styles.box, { width: s, height: s }, style]}>
        <View
          style={[
            styles.arch,
            {
              width: inner * 0.72,
              height: inner * 0.72,
              borderColor: color,
              borderWidth: STROKE,
              borderBottomWidth: 0,
              backgroundColor: focused ? `${color}14` : 'transparent',
            },
          ]}
        />
        <View
          style={[
            styles.archBase,
            {
              width: inner * 0.72,
              borderColor: color,
              borderTopWidth: STROKE,
            },
          ]}
        />
      </View>
    );
  }

  if (name === 'ai') {
    return (
      <View style={[styles.box, { width: s, height: s }, style]}>
        <View
          style={[
            styles.aiBubble,
            {
              width: inner * 0.82,
              height: inner * 0.62,
              borderColor: color,
              borderWidth: STROKE,
              backgroundColor: focused ? `${color}16` : 'transparent',
            },
          ]}
        />
        <View style={[styles.aiTail, { borderTopColor: color }]} />
        <View style={[styles.aiDot, { backgroundColor: color, left: s * 0.28, opacity: 0.9 }]} />
        <View style={[styles.aiDot, { backgroundColor: color, left: s * 0.44, opacity: 0.65 }]} />
        <View style={[styles.aiDot, { backgroundColor: color, left: s * 0.6, opacity: 0.45 }]} />
      </View>
    );
  }

  if (name === 'quran') {
    return (
      <View style={[styles.box, { width: s, height: s, flexDirection: 'row', gap: 2 }, style]}>
        <View
          style={[
            styles.bookPage,
            {
              width: inner * 0.34,
              height: inner * 0.78,
              borderColor: color,
              borderWidth: STROKE,
              backgroundColor: focused ? `${color}18` : 'transparent',
            },
          ]}
        />
        <View
          style={[
            styles.bookPage,
            {
              width: inner * 0.34,
              height: inner * 0.78,
              borderColor: color,
              borderWidth: STROKE,
            },
          ]}
        />
        <View
          style={[
            styles.bookSpine,
            {
              height: inner * 0.5,
              backgroundColor: color,
              opacity: focused ? 1 : 0.45,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.box, { width: s, height: s }, style]}>
      <View
        style={[
          styles.profileHead,
          {
            width: inner * 0.34,
            height: inner * 0.34,
            borderColor: color,
            borderWidth: STROKE,
            backgroundColor: focused ? `${color}20` : 'transparent',
          },
        ]}
      />
      <View
        style={[
          styles.profileShoulders,
          {
            width: inner * 0.72,
            height: inner * 0.34,
            borderColor: color,
            borderWidth: STROKE,
            borderTopWidth: STROKE,
            borderBottomLeftRadius: inner * 0.2,
            borderBottomRightRadius: inner * 0.2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roof: {
    transform: [{ rotate: '45deg' }, { translateY: 2 }],
    borderBottomWidth: 0,
  },
  homeBody: {
    marginTop: -4,
    borderTopWidth: 0,
    borderRadius: 3,
  },
  arch: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  archBase: {
    marginTop: -1,
  },
  bookPage: {
    borderRadius: 3,
  },
  bookSpine: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
  },
  aiBubble: {
    borderRadius: 10,
  },
  aiTail: {
    position: 'absolute',
    bottom: 4,
    left: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  aiDot: {
    position: 'absolute',
    top: 8,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  profileHead: {
    borderRadius: 999,
    marginBottom: 1,
  },
  profileShoulders: {
    borderTopWidth: 0,
  },
});

import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

type IconName =
  | 'chevron'
  | 'check'
  | 'settings'
  | 'bookmark'
  | 'book'
  | 'plus'
  | 'download'
  | 'search'
  | 'send';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: ViewStyle;
}

export function Icon({ name, size = 18, color, filled = false, style }: IconProps) {
  const { theme } = useTheme();
  const tint = color ?? theme.colors.textTertiary;

  if (name === 'chevron') {
    return (
      <View style={[styles.chevronWrap, { width: size * 0.55, height: size }, style]}>
        <View
          style={[
            styles.chevronArm,
            {
              width: size * 0.38,
              height: size * 0.38,
              borderColor: tint,
              borderTopWidth: 1.5,
              borderRightWidth: 1.5,
              transform: [{ rotate: '45deg' }],
            },
          ]}
        />
      </View>
    );
  }

  if (name === 'check') {
    return (
      <View style={[styles.checkWrap, { width: size, height: size }, style]}>
        <View
          style={[
            styles.checkMark,
            {
              width: size * 0.45,
              height: size * 0.25,
              borderColor: tint,
              borderBottomWidth: 2,
              borderLeftWidth: 2,
              transform: [{ rotate: '-45deg' }, { translateY: -1 }],
            },
          ]}
        />
      </View>
    );
  }

  if (name === 'settings') {
    const lineH = 1.5;
    const knob = size * 0.24;
    const rows = [size * 0.58, size * 0.26, size * 0.46];

    return (
      <View style={[{ width: size, height: size, justifyContent: 'space-evenly' }, style]}>
        {rows.map((knobLeft, index) => (
          <View
            key={index}
            style={{
              height: lineH,
              borderRadius: lineH,
              backgroundColor: tint,
              width: '100%',
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: knobLeft - knob / 2,
                top: (lineH - knob) / 2,
                width: knob,
                height: knob,
                borderRadius: knob / 2,
                backgroundColor: tint,
              }}
            />
          </View>
        ))}
      </View>
    );
  }

  if (name === 'bookmark') {
    const w = size * 0.54;
    const h = size;
    const stroke = 1.5;
    const headH = h * 0.66;
    const tailH = h - headH;

    if (filled) {
      return (
        <View style={[{ width: w, height: h, alignItems: 'center' }, style]}>
          <View
            style={{
              width: w,
              height: headH,
              backgroundColor: tint,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: w / 2,
              borderRightWidth: w / 2,
              borderTopWidth: tailH,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: tint,
              marginTop: -1,
            }}
          />
        </View>
      );
    }

    return (
      <View style={[{ width: w, height: h }, style]}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: headH,
            borderWidth: stroke,
            borderColor: tint,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottomWidth: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: w / 2 + stroke / 2,
            height: tailH,
            borderLeftWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: tint,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: w / 2 + stroke / 2,
            height: tailH,
            borderRightWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: tint,
          }}
        />
      </View>
    );
  }

  if (name === 'book') {
    const w = size;
    const h = size * 0.92;
    const spine = size * 0.14;
    return (
      <View style={[{ width: w, height: h }, style]}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: spine,
            borderWidth: 1.5,
            borderColor: tint,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
            backgroundColor: filled ? tint : 'transparent',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: spine - 1,
            right: 0,
            top: 0,
            bottom: 0,
            borderWidth: 1.5,
            borderColor: tint,
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3,
            borderLeftWidth: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: spine + size * 0.12,
            right: size * 0.12,
            top: h * 0.28,
            height: 1.5,
            backgroundColor: tint,
            opacity: 0.7,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: spine + size * 0.12,
            right: size * 0.12,
            top: h * 0.48,
            height: 1.5,
            backgroundColor: tint,
            opacity: 0.7,
          }}
        />
      </View>
    );
  }

  if (name === 'plus') {
    const arm = size * 0.42;
    const stroke = 1.75;
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        <View style={{ width: arm, height: stroke, backgroundColor: tint, borderRadius: stroke }} />
        <View
          style={{
            position: 'absolute',
            width: stroke,
            height: arm,
            backgroundColor: tint,
            borderRadius: stroke,
          }}
        />
      </View>
    );
  }

  if (name === 'download') {
    const barW = size * 0.58;
    const arrowW = size * 0.38;

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: barW,
              height: 1.5,
              backgroundColor: tint,
              borderRadius: 1,
              marginBottom: 2,
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: arrowW / 2,
              borderRightWidth: arrowW / 2,
              borderTopWidth: arrowW * 0.52,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: tint,
            }}
          />
        </View>
      </View>
    );
  }

  if (name === 'send') {
    return (
      <View style={[styles.send, { width: size, height: size }, style]}>
        <View
          style={[
            styles.sendPlane,
            {
              borderLeftWidth: size * 0.52,
              borderTopWidth: size * 0.24,
              borderBottomWidth: size * 0.24,
              borderLeftColor: tint,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotate: '-45deg' }, { translateX: size * 0.06 }],
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.search, { width: size, height: size, borderColor: tint }, style]}>
      <View style={[styles.searchHandle, { backgroundColor: tint }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chevronWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronArm: {
    marginLeft: -2,
  },
  checkWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {},
  send: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPlane: {
    width: 0,
    height: 0,
  },
  search: {
    borderRadius: 999,
    borderWidth: 1.5,
  },
  searchHandle: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    bottom: -1,
    right: 0,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
});

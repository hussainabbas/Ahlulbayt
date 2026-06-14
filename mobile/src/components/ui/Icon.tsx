import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

type IconName = 'chevron' | 'check' | 'settings' | 'bookmark' | 'download' | 'search' | 'send';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function Icon({ name, size = 18, color, style }: IconProps) {
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
    return (
      <View style={[styles.gear, { width: size, height: size, borderColor: tint }, style]}>
        <View style={[styles.gearCore, { backgroundColor: tint }]} />
      </View>
    );
  }

  if (name === 'bookmark') {
    return (
      <View style={[styles.bookmark, { borderColor: tint, height: size, width: size * 0.72 }, style]} />
    );
  }

  if (name === 'download') {
    return (
      <View style={[styles.download, { width: size, height: size }, style]}>
        <View style={[styles.downloadStem, { backgroundColor: tint, height: size * 0.45 }]} />
        <View
          style={[
            styles.downloadHead,
            {
              borderColor: tint,
              borderLeftWidth: 1.5,
              borderBottomWidth: 1.5,
              width: size * 0.42,
              height: size * 0.42,
              transform: [{ rotate: '-45deg' }],
            },
          ]}
        />
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
  gear: {
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearCore: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  bookmark: {
    borderWidth: 1.5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomWidth: 0,
  },
  download: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  downloadStem: {
    width: 1.5,
    borderRadius: 1,
  },
  downloadHead: {
    position: 'absolute',
    bottom: 0,
  },
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

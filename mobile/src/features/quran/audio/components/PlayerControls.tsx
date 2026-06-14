import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranPlayer } from '../hooks/useQuranPlayer';

export function PlayerControls() {
  const { theme } = useTheme();
  const { isPlaying, isBuffering, togglePlayback, skipNext, skipPrevious } = useQuranPlayer();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => void skipPrevious()} style={styles.sideBtn}>
        <Text variant="headingMd">⏮</Text>
      </Pressable>

      <Pressable
        onPress={() => void togglePlayback()}
        style={[styles.mainBtn, { backgroundColor: theme.colors.accentPrimary }]}
      >
        <Text variant="displayMd" style={{ color: theme.colors.textInverse }}>
          {isBuffering ? '…' : isPlaying ? '⏸' : '▶'}
        </Text>
      </Pressable>

      <Pressable onPress={() => void skipNext()} style={styles.sideBtn}>
        <Text variant="headingMd">⏭</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  sideBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

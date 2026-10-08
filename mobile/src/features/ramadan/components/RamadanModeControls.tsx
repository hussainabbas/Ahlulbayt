import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { RamadanModeState } from '../types';

interface RamadanModeControlsProps {
  mode: RamadanModeState;
  isModeActive: boolean;
  onSetMode: (mode: RamadanModeState) => void;
}

export function RamadanModeControls({ mode, isModeActive, onSetMode }: RamadanModeControlsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const options: RamadanModeState[] = ['auto', 'on', 'off'];

  return (
    <View style={styles.wrap}>
      <Text variant="label" color="secondary">
        {t('ramadanMode.modeLabel')} {isModeActive ? '· ' + t('ramadanMode.active') : ''}
      </Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => onSetMode(opt)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  mode === opt ? theme.colors.accentPrimaryMuted : theme.colors.backgroundSecondary,
                borderColor: mode === opt ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={mode === opt ? 'accent' : 'secondary'}>
              {t(`ramadanMode.mode.${opt}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: layout.listGap },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

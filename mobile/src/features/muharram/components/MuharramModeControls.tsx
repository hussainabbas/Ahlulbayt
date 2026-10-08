import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MuharramModeState } from '../types';

interface MuharramModeControlsProps {
  mode: MuharramModeState;
  blackTheme: boolean;
  isModeActive: boolean;
  onSetMode: (mode: MuharramModeState) => void;
  onToggleBlackTheme: () => void;
}

export function MuharramModeControls({
  mode,
  blackTheme,
  isModeActive,
  onSetMode,
  onToggleBlackTheme,
}: MuharramModeControlsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const modes: MuharramModeState[] = ['auto', 'on', 'off'];

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.lg }]}>
      <Text variant="overline" color="secondary">
        {t('muharramMode.settings')}
      </Text>
      <View style={styles.modeRow}>
        {modes.map((m) => (
          <Pressable
            key={m}
            onPress={() => onSetMode(m)}
            style={[
              styles.modeChip,
              {
                backgroundColor:
                  mode === m ? theme.colors.accentPrimaryMuted : theme.colors.surfaceElevated,
                borderColor: mode === m ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={mode === m ? 'accent' : 'secondary'}>
              {t(`muharramMode.mode.${m}`)}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={onToggleBlackTheme} style={styles.toggleRow}>
        <View style={{ flex: 1 }}>
          <Text variant="bodySm">{t('muharramMode.blackTheme')}</Text>
          <Text variant="caption" color="tertiary">
            {isModeActive && blackTheme
              ? t('muharramMode.blackThemeOn')
              : t('muharramMode.blackThemeOff')}
          </Text>
        </View>
        <View
          style={[
            styles.switch,
            {
              backgroundColor: blackTheme ? theme.colors.accentPrimary : theme.colors.borderStrong,
            },
          ]}
        >
          <View
            style={[
              styles.knob,
              { transform: [{ translateX: blackTheme ? 18 : 2 }] },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  switch: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F2F0EB',
  },
});

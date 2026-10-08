import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { QiblaViewMode } from '../types';

interface QiblaModeTabsProps {
  active: QiblaViewMode;
  onChange: (mode: QiblaViewMode) => void;
}

const MODES: Array<{ id: QiblaViewMode; labelKey: string }> = [
  { id: 'compass', labelKey: 'qibla.modes.compass' },
  { id: 'map', labelKey: 'qibla.modes.map' },
  { id: 'ar', labelKey: 'qibla.modes.ar' },
];

export function QiblaModeTabs({ active, onChange }: QiblaModeTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      {MODES.map((mode) => {
        const isActive = active === mode.id;
        return (
          <Pressable
            key={mode.id}
            onPress={() => onChange(mode.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceMuted,
                borderColor: isActive ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={isActive ? 'accent' : 'secondary'}>
              {t(mode.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
});

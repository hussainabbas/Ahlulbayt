import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { HADITH_SOURCES } from '../constants/catalog';
import type { HadithSource } from '../types';

interface HadithSourceTabsProps {
  active: HadithSource | 'all';
  onChange: (source: HadithSource | 'all') => void;
}

export function HadithSourceTabs({ active, onChange }: HadithSourceTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const tabs: Array<{ id: HadithSource | 'all'; label: string }> = [
    { id: 'all', label: t('hadith.filter.all') },
    ...HADITH_SOURCES.map((s) => ({ id: s.id, label: `${s.icon} ${t(s.nameKey)}` })),
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
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
            <Text variant="bodySm" color={isActive ? 'accent' : 'secondary'}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
});

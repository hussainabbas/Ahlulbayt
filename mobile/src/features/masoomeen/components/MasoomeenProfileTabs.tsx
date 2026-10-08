import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MasoomeenProfileTab } from '../types';

interface MasoomeenProfileTabsProps {
  active: MasoomeenProfileTab;
  onChange: (tab: MasoomeenProfileTab) => void;
}

const TABS: Array<{ id: MasoomeenProfileTab; labelKey: string }> = [
  { id: 'biography', labelKey: 'masoomeen.tabs.biography' },
  { id: 'timeline', labelKey: 'masoomeen.tabs.timeline' },
  { id: 'quotes', labelKey: 'masoomeen.tabs.quotes' },
  { id: 'events', labelKey: 'masoomeen.tabs.events' },
  { id: 'books', labelKey: 'masoomeen.tabs.books' },
];

export function MasoomeenProfileTabs({ active, onChange }: MasoomeenProfileTabsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {TABS.map((tab) => {
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
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
});

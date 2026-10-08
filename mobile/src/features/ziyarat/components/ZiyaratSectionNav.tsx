import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { ZiyaratSection } from '../types';

interface ZiyaratSectionNavProps {
  sections: ZiyaratSection[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ZiyaratSectionNav({ sections, activeIndex, onSelect }: ZiyaratSectionNavProps) {
  const { locale } = useLocale();
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.wrap}
    >
      {sections.map((section, index) => {
        const active = index === activeIndex;
        const label =
          (locale === 'ur' ? section.title?.ur : section.title?.en) ?? `${index + 1}`;
        return (
          <Pressable
            key={section.id}
            onPress={() => onSelect(index)}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceMuted,
                borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
              },
            ]}
          >
            <Text variant="caption" color={active ? 'accent' : 'secondary'}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    maxHeight: 44,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});

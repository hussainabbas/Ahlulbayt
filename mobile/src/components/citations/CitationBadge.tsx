import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { IslamicCitation } from '@/core/citations';
import { formatCitation } from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface CitationBadgeProps {
  citation: IslamicCitation;
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  const isUnverified = !citation.verified;
  const label = isUnverified ? t('citations.unverified') : formatCitation(citation, locale);

  if (!label) return null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: isUnverified
            ? theme.colors.surfaceMuted
            : theme.colors.accentPrimaryMuted,
          borderColor: isUnverified
            ? theme.colors.borderSubtle
            : theme.colors.accentPrimary,
        },
      ]}
    >
      <Text variant="overline" color={isUnverified ? 'tertiary' : 'accent'}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

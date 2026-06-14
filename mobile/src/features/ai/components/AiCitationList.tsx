import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { AiCitation } from '../types';

interface AiCitationListProps {
  citations: AiCitation[];
}

export function AiCitationList({ citations }: AiCitationListProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (citations.length === 0) return null;

  return (
    <View style={[styles.box, { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.sm }]}>
      <Text variant="overline" color="tertiary">
        {t('ai.sources')}
      </Text>
      {citations.map((c) => (
        <Text key={c.id} variant="caption" color="secondary" style={{ marginTop: 4 }}>
          · {c.title}
          {c.source ? ` — ${c.source}` : ''}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 8,
    marginLeft: 4,
    padding: 10,
    maxWidth: '88%',
  },
});

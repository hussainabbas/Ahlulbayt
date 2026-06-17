import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { IslamicSourceCitation } from '../types';

interface CitationListProps {
  citations: IslamicSourceCitation[];
  compact?: boolean;
}

export function CitationList({ citations, compact }: CitationListProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (!citations.length) {
    return (
      <Text variant="caption" color="tertiary">
        {t('references.unavailable')}
      </Text>
    );
  }

  return (
    <View style={styles.list}>
      {citations.map((c, i) => (
        <View
          key={`${c.book}-${i}`}
          style={[
            styles.item,
            compact ? styles.compact : null,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <Text variant={compact ? 'caption' : 'bodySm'} weight="600">
            {c.book}
            {c.unverified ? ` (${t('ramadanMode.unverified')})` : ''}
          </Text>
          <Text variant="caption" color="secondary">
            {[
              c.chapter ? `${t('references.chapter')}: ${c.chapter}` : null,
              c.volume != null ? `${t('references.volume')} ${c.volume}` : null,
              c.page != null ? `${t('references.page')} ${c.page}` : null,
              c.hadithNumber ? `${t('references.hadithNumber')} ${c.hadithNumber}` : null,
              c.scholar ? `${t('references.scholar')}: ${c.scholar}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
          {c.note ? (
            <Text variant="caption" color="tertiary">
              {c.note}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: layout.listGap,
  },
  item: {
    padding: layout.listGap + 2,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  compact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});

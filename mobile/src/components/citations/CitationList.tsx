import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { IslamicCitation } from '@/core/citations';
import { hasVerifiedCitation } from '@/core/citations';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';

import { CitationCard } from './CitationCard';
import { UnverifiedDisclaimer } from './UnverifiedDisclaimer';

interface CitationListProps {
  citations: IslamicCitation[];
  titleKey?: string;
  compact?: boolean;
  showDisclaimer?: boolean;
  showTitle?: boolean;
}

export function CitationList({
  citations,
  titleKey = 'citations.references',
  compact,
  showDisclaimer = true,
  showTitle = true,
}: CitationListProps) {
  const { t } = useLocale();

  if (citations.length === 0) {
    return showDisclaimer ? <UnverifiedDisclaimer /> : null;
  }

  const verified = hasVerifiedCitation(citations);

  return (
    <View style={styles.root}>
      {showTitle ? (
        <Text variant="label" color="tertiary">
          {t(titleKey)}
        </Text>
      ) : null}
      {showDisclaimer && !verified ? <UnverifiedDisclaimer compact /> : null}
      {citations.map((citation, index) => (
        <CitationCard
          key={citation.id ?? `cite-${index}`}
          citation={citation}
          compact={compact}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.listGap,
    width: '100%',
  },
});

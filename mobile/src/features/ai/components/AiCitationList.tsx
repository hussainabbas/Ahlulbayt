import { StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { citationsFromAi } from '@/core/citations';

import type { AiCitation } from '../types';

interface AiCitationListProps {
  citations: AiCitation[];
}

/** Renders AI assistant citations using the universal citation engine. */
export function AiCitationList({ citations }: AiCitationListProps) {
  const mapped = citationsFromAi(citations);
  if (mapped.length === 0) return null;

  return (
    <View style={styles.root}>
      <CitationList
        citations={mapped}
        titleKey="references.sourcesUsed"
        compact
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 8,
    marginLeft: 4,
    maxWidth: '88%',
  },
});

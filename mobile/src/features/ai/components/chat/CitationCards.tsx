import { StyleSheet, View } from 'react-native';

import { SourcesUsedSection } from '@/components/references';
import {
  aiCitationsToReferences,
  resolveReferenceNavigation,
  type IslamicReference,
} from '@/core/references';

import type { AiCitation } from '../../types';

interface CitationCardsProps {
  citations?: AiCitation[];
  references?: IslamicReference[];
  onCitationPress?: (citation: AiCitation) => void;
  onReferencePress?: (reference: IslamicReference) => void;
}

export function CitationCards({
  citations,
  references,
  onCitationPress,
  onReferencePress,
}: CitationCardsProps) {
  const converted = aiCitationsToReferences(citations);
  const hasRefs = (references?.length ?? 0) > 0 || converted.length > 0;
  if (!hasRefs) return null;

  const handleReferencePress =
    onReferencePress ??
    ((ref: IslamicReference) => {
      const target = resolveReferenceNavigation(ref);
      if (!target) return;
      onCitationPress?.({
        id: ref.id,
        title: ref.primarySource.en,
        source: ref.bookName?.en,
        reference: ref.scholar?.en,
      });
    });

  return (
    <View style={styles.root}>
      <SourcesUsedSection
        references={references}
        convertedReferences={converted}
        onReferencePress={handleReferencePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
});

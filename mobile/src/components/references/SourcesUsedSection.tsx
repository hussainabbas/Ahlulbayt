import {
  enforceAiReferences,
  type IslamicReference,
} from '@/core/references';

import { ReferenceList } from './ReferenceList';

interface SourcesUsedSectionProps {
  references?: IslamicReference[];
  convertedReferences?: IslamicReference[];
  onReferencePress?: (reference: IslamicReference) => void;
}

/** Mandatory "Sources Used" block for AI assistant responses. */
export function SourcesUsedSection({
  references,
  convertedReferences,
  onReferencePress,
}: SourcesUsedSectionProps) {
  const enforcement = enforceAiReferences(references, convertedReferences);

  return (
    <ReferenceList
      references={enforcement.references}
      titleKey="references.sourcesUsed"
      compact
      onReferencePress={onReferencePress}
    />
  );
}

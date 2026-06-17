import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import {
  filterReferencesByMarja,
  mergeReferences,
  shouldShowReferenceWarning,
  verifyReferences,
  type IslamicReference,
} from '@/core/references';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useSettingsStore } from '@/stores/settingsStore';

import { ReferenceCard } from './ReferenceCard';
import { ReferenceUnavailableBanner } from './ReferenceUnavailableBanner';

interface ReferenceListProps {
  references: IslamicReference[];
  titleKey?: string;
  compact?: boolean;
  filterMarja?: boolean;
  onReferencePress?: (reference: IslamicReference) => void;
}

export function ReferenceList({
  references,
  titleKey = 'references.title',
  compact,
  filterMarja = true,
  onReferencePress,
}: ReferenceListProps) {
  const { t } = useLocale();
  const marja = useSettingsStore((s) => s.marja);
  const filtered = filterMarja ? filterReferencesByMarja(references, marja) : references;
  const visible = mergeReferences(filtered);
  const report = verifyReferences(visible);

  if (visible.length === 0) {
    return <ReferenceUnavailableBanner />;
  }

  return (
    <View style={styles.root}>
      <Text variant="label" color="tertiary">
        {t(titleKey)}
      </Text>
      {shouldShowReferenceWarning(report) ? <ReferenceUnavailableBanner compact /> : null}
      {visible.map((ref) => (
        <ReferenceCard
          key={ref.id}
          reference={ref}
          compact={compact}
          onPress={onReferencePress ? () => onReferencePress(ref) : undefined}
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

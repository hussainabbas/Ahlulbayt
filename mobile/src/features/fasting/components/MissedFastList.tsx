import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { MissedFast } from '../types';

interface MissedFastListProps {
  items: MissedFast[];
  onMarkQada: (id: string) => void;
  onRemove: (id: string) => void;
}

export function MissedFastList({ items, onMarkQada, onRemove }: MissedFastListProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (items.length === 0) {
    return (
      <Text variant="bodySm" color="tertiary">
        {t('fasting.missed.empty')}
      </Text>
    );
  }

  const pending = items.filter((m) => !m.qadaCompleted);
  const completed = items.filter((m) => m.qadaCompleted);

  return (
    <View style={styles.root}>
      {pending.map((item) => (
        <View
          key={item.id}
          style={[
            styles.row,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.meta}>
            <Text variant="bodySm" weight="600">
              {item.dateKey}
            </Text>
            <Text variant="caption" color="secondary">
              {t(`fasting.missed.reasons.${item.reason}`)}
              {item.reasonNotes ? ` — ${item.reasonNotes}` : ''}
            </Text>
          </View>
          <View style={styles.actions}>
            <Button
              label={t('fasting.missed.markQada')}
              size="md"
              variant="secondary"
              onPress={() => onMarkQada(item.id)}
            />
            <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
              <Text variant="caption" color="tertiary">
                {t('common.delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      {completed.length > 0 ? (
        <Text variant="caption" color="tertiary" style={styles.completedHeader}>
          {t('fasting.missed.qadaDone', { count: completed.length })}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.blockGap,
  },
  row: {
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: layout.listGap,
  },
  meta: {
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
  },
  completedHeader: {
    marginTop: 4,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { EventTimelineEntry } from '@/core/islamic-events';
import { hasVerifiedReferences } from '@/core/islamic-events';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';

interface DailyTimelineWidgetProps {
  entries: EventTimelineEntry[];
}

export function DailyTimelineWidget({ entries }: DailyTimelineWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  if (entries.length === 0) return null;

  const entry = entries[0]!;
  const verified = hasVerifiedReferences(entry.references);

  const onPress = () => {
    if (entry.route) {
      rootNavigation.navigate(
        entry.route.screen,
        entry.route.params as RootStackParamList[typeof entry.route.screen],
      );
      return;
    }
    if (entry.ziyaratId) {
      rootNavigation.navigate('ZiyaratReader', { ziyaratId: entry.ziyaratId });
      return;
    }
    if (entry.duaId) {
      rootNavigation.navigate('DuaReader', { duaId: entry.duaId });
      return;
    }
    rootNavigation.navigate('Calendar');
  };

  return (
    <DashboardWidget
      label={t('islamicEvents.timeline.today')}
      actionLabel={t('islamicEvents.timeline.open')}
      onAction={onPress}
      accentColor={theme.colors.accentPrimary}
    >
      <Pressable onPress={onPress} style={styles.body}>
        <Text variant="headingSm">{t(entry.titleKey)}</Text>
        <Text variant="bodySm" color="secondary">
          {t(entry.bodyKey)}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: verified
                  ? theme.colors.accentPrimaryMuted
                  : theme.colors.surfaceMuted,
              },
            ]}
          >
            <Text variant="caption" color={verified ? 'accent' : 'tertiary'}>
              {verified
                ? t('islamicEvents.references.verified', {
                    count: entry.references.length,
                  })
                : t('islamicEvents.references.unverified')}
            </Text>
          </View>
          {entry.references[0]?.primarySource.en ? (
            <Text variant="caption" color="tertiary" numberOfLines={1} style={styles.source}>
              {entry.references[0].primarySource.en}
              {entry.references[0].volume != null
                ? ` · ${t('islamicEvents.references.vol')} ${entry.references[0].volume}`
                : ''}
              {entry.references[0].page != null
                ? ` · ${t('islamicEvents.references.p')} ${entry.references[0].page}`
                : ''}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: layout.listGap,
  },
  meta: {
    gap: 6,
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  source: {
    lineHeight: 16,
  },
});

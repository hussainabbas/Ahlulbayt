import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useTheme } from '@/theme/ThemeContext';

import { RecommendationCard } from './RecommendationCard';
import type { ScoredRecommendation } from '../types';

interface RecommendationFeedProps {
  items: ScoredRecommendation[];
  onDismiss?: (id: string) => void;
  onImpression?: (items: ScoredRecommendation[]) => void;
}

export function RecommendationFeed({ items, onDismiss, onImpression }: RecommendationFeedProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  useEffect(() => {
    if (items.length > 0) onImpression?.(items);
  }, [items, onImpression]);

  const handlePress = (rec: ScoredRecommendation) => {
    const { payload } = rec.item;

    if (payload.duaId) {
      rootNavigation.navigate('DuaReader', { duaId: payload.duaId });
      return;
    }
    if (payload.ziyaratId) {
      rootNavigation.navigate('ZiyaratReader', { ziyaratId: payload.ziyaratId });
      return;
    }
    if (payload.quranSearchQuery) {
      rootNavigation.navigate('QuranSearch', { query: payload.quranSearchQuery });
      return;
    }
    if (payload.route === 'Prayer') {
      rootNavigation.navigate('Main', { screen: 'Prayer' });
      return;
    }
    if (payload.route === 'TasbihCounter') {
      rootNavigation.navigate('TasbihCounter');
      return;
    }
    if (payload.route === 'Tasbih') {
      rootNavigation.navigate('Tasbih');
      return;
    }
    if (payload.route === 'MuharramMode') {
      rootNavigation.navigate('MuharramMode');
      return;
    }
    if (payload.route === 'Calendar') {
      rootNavigation.navigate('Calendar');
      return;
    }
    if (payload.route === 'Mafatih') {
      rootNavigation.navigate('Mafatih');
      return;
    }

    rootNavigation.navigate('Main', {
      screen: 'AiAssistant',
      params: { seedPrompt: t(rec.item.subtitleKey) },
    });
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="overline" color="secondary">
          {t('recommendations.title')}
        </Text>
        <Pressable onPress={() => rootNavigation.navigate('Main', { screen: 'AiAssistant' })}>
          <Text variant="caption" color="accent">
            {t('recommendations.askAi')} ›
          </Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((rec) => (
          <RecommendationCard
            key={rec.item.id}
            recommendation={rec}
            onPress={() => handlePress(rec)}
            onDismiss={onDismiss ? () => onDismiss(rec.item.id) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  scroll: { gap: 12, paddingRight: 4 },
});

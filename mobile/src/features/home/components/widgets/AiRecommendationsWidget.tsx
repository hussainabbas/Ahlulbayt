import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { useTheme } from '@/theme/ThemeContext';

import type { AiRecommendation } from '../../types';

interface AiRecommendationsWidgetProps {
  recommendations: AiRecommendation[];
}

const PROMPT_MAP: Record<string, string> = {
  quran_reflection: 'ai.prompts.quranReflectionMessage',
  imam_husayn: 'ai.prompts.whoHusaynMessage',
  daily_amaal: 'ai.prompts.duaTonightMessage',
  karbala_history: 'ai.prompts.calendarTodayMessage',
  lecture_summary: 'ai.prompts.whoHusaynMessage',
  prayer_guidance: 'ai.prompts.prayerNextMessage',
  dua_meaning: 'ai.prompts.duaTonightMessage',
  ziyarat_guide: 'ai.prompts.ziyaratMuharramMessage',
};

export function AiRecommendationsWidget({ recommendations }: AiRecommendationsWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  if (recommendations.length === 0) return null;

  const openAi = (rec: AiRecommendation) => {
    const seedKey = PROMPT_MAP[rec.id];
    rootNavigation.navigate('Main', {
      screen: 'AiAssistant',
      params: seedKey ? { seedPrompt: t(seedKey) } : undefined,
    });
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="overline" color="secondary">
          {t('home.ai.title')}
        </Text>
        <Text variant="caption" color="accent">
          {t('home.ai.powered')}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {recommendations.map((rec) => (
          <Pressable
            key={rec.id}
            onPress={() => openAi(rec)}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <Text variant="headingMd" style={styles.icon}>
              {rec.icon}
            </Text>
            <Text variant="headingSm" numberOfLines={2}>
              {t(rec.titleKey)}
            </Text>
            <Text variant="caption" color="secondary" numberOfLines={2} style={{ marginTop: 4 }}>
              {t(rec.subtitleKey)}
            </Text>
            <View style={[styles.chip, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
              <Text variant="caption" color="accent">
                {t('home.ai.ask')}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  scroll: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 200,
    padding: 16,
    borderWidth: 1,
    gap: 2,
  },
  icon: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  chip: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

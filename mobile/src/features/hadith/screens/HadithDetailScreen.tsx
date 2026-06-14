import { useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { HadithListRow } from '../components/HadithListRow';
import { HadithReferenceCard } from '../components/HadithReferenceCard';
import { HadithSummaryCard } from '../components/HadithSummaryCard';
import { PremiumGate } from '@/features/monetization/components/PremiumGate';
import { HadithRepository } from '../engine/hadithRepository';
import { getHadithSummary } from '../engine/summaryEngine';
import { useHadithBookmarkStore } from '../stores/hadithBookmarkStore';
import type { HadithId } from '../types';
import { pickLocalized } from '../utils/localize';

type DetailTab = 'text' | 'reference' | 'summary';

export function HadithDetailScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'HadithDetail'>>();
  const hadithId = route.params.hadithId as HadithId;

  const [activeTab, setActiveTab] = useState<DetailTab>('text');

  const entry = useMemo(() => HadithRepository.getEntry(hadithId), [hadithId]);
  const aiSummary = useMemo(
    () => (entry ? getHadithSummary(hadithId, locale) : null),
    [entry, hadithId, locale],
  );
  const related = useMemo(() => HadithRepository.getRelated(hadithId), [hadithId]);

  const isBookmarked = useHadithBookmarkStore((s) => s.isBookmarked(hadithId));
  const toggleBookmark = useHadithBookmarkStore((s) => s.toggleBookmark);

  useLayoutEffect(() => {
    const title = entry ? pickLocalized(entry.title, locale) : t('hadith.title');
    navigation.setOptions({
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerRight: () => (
        <Pressable onPress={() => toggleBookmark(hadithId)} hitSlop={12} style={styles.starBtn}>
          <Text variant="headingMd" color={isBookmarked ? 'accent' : 'tertiary'}>
            {isBookmarked ? '★' : '☆'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, entry, locale, t, theme, isBookmarked, hadithId, toggleBookmark]);

  if (!entry || !aiSummary) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('hadith.notFound')}
        </Text>
      </Screen>
    );
  }

  const tabs: Array<{ id: DetailTab; labelKey: string }> = [
    { id: 'text', labelKey: 'hadith.tabs.text' },
    { id: 'reference', labelKey: 'hadith.tabs.reference' },
    { id: 'summary', labelKey: 'hadith.tabs.summary' },
  ];

  return (
    <Screen scroll>
      {entry.speaker ? (
        <Text variant="caption" color="tertiary" style={styles.speaker}>
          {pickLocalized(entry.speaker, locale)}
        </Text>
      ) : null}

      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabChip,
                {
                  backgroundColor: active
                    ? theme.colors.accentPrimaryMuted
                    : theme.colors.surfaceMuted,
                  borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
                },
              ]}
            >
              <Text variant="bodySm" color={active ? 'accent' : 'secondary'}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'text' ? (
        <Card style={styles.textCard}>
          {entry.arabic ? (
            <Text
              variant="bodyLg"
              style={[styles.arabic, { color: theme.colors.accentPrimary }]}
            >
              {entry.arabic}
            </Text>
          ) : null}
          <Text variant="bodyMd" style={styles.body}>
            {pickLocalized(entry.text, locale)}
          </Text>
          <View style={styles.topicRow}>
            {entry.topics.map((topic) => (
              <View
                key={topic}
                style={[styles.topicChip, { backgroundColor: theme.colors.surfaceMuted }]}
              >
                <Text variant="caption" color="secondary">
                  {t(`hadith.topics.${topic}`)}
                </Text>
              </View>
            ))}
          </View>
          {entry.nahjulId ? (
            <Pressable
              onPress={() => navigation.navigate('NahjulReader', { nahjulId: entry.nahjulId! })}
              style={styles.linkBtn}
            >
              <Text variant="bodySm" color="accent">
                {t('hadith.openNahjul')} ›
              </Text>
            </Pressable>
          ) : null}
        </Card>
      ) : null}

      {activeTab === 'reference' ? <HadithReferenceCard entry={entry} /> : null}

      {activeTab === 'summary' ? (
        <PremiumGate entitlement="exclusive_content" overlay>
          <HadithSummaryCard aiSummary={aiSummary} />
        </PremiumGate>
      ) : null}

      {related.length > 0 ? (
        <View style={styles.related}>
          <Text variant="headingSm" style={styles.relatedTitle}>
            {t('hadith.related')}
          </Text>
          {related.map((rel) => (
            <HadithListRow
              key={rel.id}
              entry={rel}
              onPress={() => navigation.push('HadithDetail', { hadithId: rel.id })}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  starBtn: { marginRight: 8 },
  speaker: { marginBottom: 8 },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  textCard: { gap: 12, marginBottom: 16 },
  arabic: {
    textAlign: 'right',
    lineHeight: 32,
    writingDirection: 'rtl',
  },
  body: { lineHeight: 26 },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  linkBtn: { marginTop: 8 },
  related: { marginTop: 24, gap: 10 },
  relatedTitle: { marginBottom: 4 },
});

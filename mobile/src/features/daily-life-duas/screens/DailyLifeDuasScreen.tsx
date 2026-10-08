import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Icon } from '@/components/ui/Icon';
import {
  COLLAPSIBLE_TOOLBAR_SEARCH_ONLY,
  CollapsibleHubToolbar,
} from '@/components/ui/CollapsibleHubToolbar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { DuaSearchBar } from '@/features/dua/components/DuaSearchBar';

import { CategoryGridCard } from '../components/CategoryGridCard';
import { DailyLifeListRow } from '../components/DailyLifeListRow';
import { DailyLifeSectionHeader } from '../components/DailyLifeSectionHeader';
import { DiscoverDuaCard } from '../components/DiscoverDuaCard';
import { QuickActionTile } from '../components/QuickActionTile';
import { TodaysDuaHeroCard } from '../components/TodaysDuaHeroCard';
import { QUICK_ACTIONS } from '../constants/categories';
import { DailyLifeDuaRepository } from '../engine/dailyLifeDuaRepository';
import type { DailyLifeCategoryId, DailyLifeDuaId, DailyLifeDuaMeta } from '../types';

const QUICK_ACTION_LABELS: Record<string, string> = {
  morning_dua: 'dailyLifeDuas.quickActions.morning',
  evening_dua: 'dailyLifeDuas.quickActions.evening',
  travel_dua: 'dailyLifeDuas.quickActions.travel',
  home_dua: 'dailyLifeDuas.quickActions.home',
};

const QUICK_ACTION_ICONS: Record<string, string> = {
  morning_dua: '🌅',
  evening_dua: '🌙',
  travel_dua: '🚗',
  home_dua: '🏠',
};

const QUICK_ACTION_TINTS: Record<string, string> = {
  morning_dua: 'rgba(196, 169, 98, 0.2)',
  evening_dua: 'rgba(74, 111, 165, 0.18)',
  travel_dua: 'rgba(184, 149, 107, 0.2)',
  home_dua: 'rgba(31, 92, 82, 0.16)',
};

export function DailyLifeDuasScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const [discoverDua, setDiscoverDua] = useState<DailyLifeDuaMeta>(() =>
    DailyLifeDuaRepository.getRandomDailyDua(),
  );

  const categories = DailyLifeDuaRepository.listCategories();
  const todaysDua = useMemo(() => DailyLifeDuaRepository.getTodaysDua(), []);
  const duaCount = DailyLifeDuaRepository.listDuas().length;

  const showingSearch = query.trim().length >= 2;
  const searchHits = useMemo(
    () => (showingSearch ? DailyLifeDuaRepository.search(query) : []),
    [query, showingSearch],
  );

  const openDua = useCallback(
    (duaId: DailyLifeDuaId) => {
      navigation.navigate('DailyLifeDuaReader', { duaId });
    },
    [navigation],
  );

  const openCategory = useCallback(
    (categoryId: DailyLifeCategoryId) => {
      navigation.navigate('DailyLifeCategory', { categoryId });
    },
    [navigation],
  );

  const shuffleDiscover = useCallback(() => {
    setDiscoverDua(DailyLifeDuaRepository.getShuffledDua(todaysDua.id));
  }, [todaysDua.id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t('dailyLifeDuas.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  return (
    <Screen padded={false} safeTop={false} edges={['left', 'right']}>
      <CollapsibleHubToolbar
        scrollY={scrollY}
        search={<DuaSearchBar value={query} onChangeText={setQuery} placeholderKey="dailyLifeDuas.searchPlaceholder" />}
        searchOnly
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        contentContainerStyle={[
          styles.content,
          { paddingTop: COLLAPSIBLE_TOOLBAR_SEARCH_ONLY + 6 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!showingSearch ? (
          <View style={styles.intro}>
            <Text variant="bodySm" color="secondary" style={styles.subtitle}>
              {t('dailyLifeDuas.subtitle')}
            </Text>
            <View style={[styles.statsPill, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
              <Icon name="check" size={12} color={theme.colors.accentPrimary} />
              <Text variant="caption" color="accent" weight="600">
                {t('dailyLifeDuas.stats', { count: duaCount })}
              </Text>
            </View>
          </View>
        ) : null}

        {showingSearch ? (
          <View style={styles.section}>
            <DailyLifeSectionHeader
              title={t('dailyLifeDuas.searchResults', { count: searchHits.length })}
            />
            {searchHits.length === 0 ? (
              <EmptyState title={t('dailyLifeDuas.noResults')} />
            ) : (
              searchHits.map(({ meta }) => (
                <DailyLifeListRow key={meta.id} meta={meta} onPress={() => openDua(meta.id)} />
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <TodaysDuaHeroCard meta={todaysDua} onPress={() => openDua(todaysDua.id)} />
            </View>

            <View style={styles.section}>
              <DiscoverDuaCard
                meta={discoverDua}
                onPress={() => openDua(discoverDua.id)}
                onShuffle={shuffleDiscover}
              />
            </View>

            <View style={styles.section}>
              <DailyLifeSectionHeader title={t('dailyLifeDuas.quickActions.title')} />
              <View style={styles.quickGrid}>
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionTile
                    key={action.id}
                    labelKey={QUICK_ACTION_LABELS[action.id]!}
                    icon={QUICK_ACTION_ICONS[action.id]!}
                    tint={QUICK_ACTION_TINTS[action.id]!}
                    onPress={() => {
                      const meta = DailyLifeDuaRepository.getQuickAction(action.id);
                      if (meta) openDua(meta.id);
                    }}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <DailyLifeSectionHeader
                title={t('dailyLifeDuas.categories')}
                subtitle={t('dailyLifeDuas.browseCategories')}
              />
              <View style={styles.grid}>
                {categories.map((category) => (
                  <CategoryGridCard
                    key={category.id}
                    category={category}
                    onPress={() => openCategory(category.id)}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 36,
    gap: 18,
  },
  intro: {
    gap: 8,
    marginBottom: 2,
  },
  subtitle: {
    maxWidth: '96%',
    lineHeight: 20,
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  section: {
    gap: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
});

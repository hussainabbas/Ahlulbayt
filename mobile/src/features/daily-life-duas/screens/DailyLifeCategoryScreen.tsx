import { useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';
import { layout } from '@/theme/layout';

import { CategoryHeroHeader } from '../components/CategoryHeroHeader';
import { DailyLifeDuaCard } from '../components/DailyLifeDuaCard';
import { DailyLifeSectionHeader } from '../components/DailyLifeSectionHeader';
import { DailyLifeDuaRepository } from '../engine/dailyLifeDuaRepository';
import type { DailyLifeCategoryId, DailyLifeDuaId } from '../types';
import { pickLocalized } from '../utils/localizedContent';

export function DailyLifeCategoryScreen() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DailyLifeCategory'>>();
  const categoryId = route.params.categoryId as DailyLifeCategoryId;

  const category = useMemo(
    () => DailyLifeDuaRepository.listCategories().find((c) => c.id === categoryId),
    [categoryId],
  );

  const duas = useMemo(() => DailyLifeDuaRepository.listByCategory(categoryId), [categoryId]);

  useLayoutEffect(() => {
    if (!category) return;
    const title = pickLocalized(category.titles, locale);
    navigation.setOptions({
      headerShown: true,
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [category, locale, navigation, theme]);

  if (!category) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('dailyLifeDuas.notFound')}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen padded={false} edges={['left', 'right']}>
      <FlatList
        data={duas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <CategoryHeroHeader category={category} duaCount={duas.length} />
            <DailyLifeSectionHeader title={t('dailyLifeDuas.inThisCategory')} />
          </View>
        }
        ListFooterComponent={
          <Text variant="caption" color="tertiary" style={styles.footerNote}>
            {t('dailyLifeDuas.offlineNote')}
          </Text>
        }
        renderItem={({ item, index }) => (
          <DailyLifeDuaCard
            meta={item}
            index={index}
            onPress={() =>
              navigation.navigate('DailyLifeDuaReader', { duaId: item.id as DailyLifeDuaId })
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: layout.listGap,
    paddingBottom: 36,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 4,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
});

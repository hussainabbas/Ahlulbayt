import { useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { BiographySection } from '../components/BiographySection';
import { BooksSection } from '../components/BooksSection';
import { EventsSection } from '../components/EventsSection';
import { MasoomeenHeroHeader } from '../components/MasoomeenHeroHeader';
import { MasoomeenProfileTabs } from '../components/MasoomeenProfileTabs';
import { QuotesSection } from '../components/QuotesSection';
import { TimelineSection } from '../components/TimelineSection';
import { MasoomeenRepository } from '../engine/masoomeenRepository';
import { useMasoomeenBookmarkStore } from '../stores/masoomeenBookmarkStore';
import type { MasoomeenId, MasoomeenProfileTab } from '../types';
import { pickLocalized } from '../utils/localize';

export function MasoomeenProfileScreen() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MasoomeenProfile'>>();
  const masoomeenId = route.params.masoomeenId as MasoomeenId;

  const [activeTab, setActiveTab] = useState<MasoomeenProfileTab>('biography');

  const profile = useMemo(() => MasoomeenRepository.getProfile(masoomeenId), [masoomeenId]);
  const isBookmarked = useMasoomeenBookmarkStore((s) => s.isBookmarked(masoomeenId));
  const toggleBookmark = useMasoomeenBookmarkStore((s) => s.toggleBookmark);

  useLayoutEffect(() => {
    const title = profile ? pickLocalized(profile.meta.titles, locale) : t('masoomeen.title');
    navigation.setOptions({
      title,
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, profile, locale, t, theme]);

  if (!profile) {
    return (
      <Screen>
        <Text variant="bodyMd" color="secondary">
          {t('masoomeen.notFound')}
        </Text>
      </Screen>
    );
  }

  const { meta } = profile;

  return (
    <Screen scroll>
      <MasoomeenHeroHeader
        meta={meta}
        bookmarked={isBookmarked}
        onToggleBookmark={() => toggleBookmark(masoomeenId)}
      />

      <MasoomeenProfileTabs active={activeTab} onChange={setActiveTab} />

      <View style={styles.tabContent}>
        {activeTab === 'biography' ? (
          <BiographySection sections={profile.biography} />
        ) : null}
        {activeTab === 'timeline' ? (
          <TimelineSection entries={profile.timeline} accentColor={meta.accentColor} />
        ) : null}
        {activeTab === 'quotes' ? (
          profile.quotes.length > 0 ? (
            <QuotesSection quotes={profile.quotes} />
          ) : (
            <Text variant="bodyMd" color="secondary">
              {t('masoomeen.noQuotes')}
            </Text>
          )
        ) : null}
        {activeTab === 'events' ? (
          <EventsSection events={profile.events} />
        ) : null}
        {activeTab === 'books' ? (
          <BooksSection books={profile.books} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    marginTop: 16,
    marginBottom: 24,
  },
});

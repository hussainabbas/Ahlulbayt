import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReferenceList } from '@/components/references/ReferenceList';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { mergeReferences } from '@/core/references';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { SEHRI_IFTAR_RULINGS, QADA_RULINGS } from '../data/jafariRulings';
import { FastDayCalendar } from '../components/FastDayCalendar';
import { FiqhDisclaimerBanner } from '../components/FiqhDisclaimerBanner';
import { MissedFastList } from '../components/MissedFastList';
import { RamadanProgressRing } from '../components/RamadanProgressRing';
import { SehriIftarCountdown } from '../components/SehriIftarCountdown';
import { useFastingHub } from '../hooks/useFastingHub';

export function FastingHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hub = useFastingHub();
  const [showMissedForm, setShowMissedForm] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('fasting.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const handleToggleToday = () => {
    hub.toggleFast(hub.isRamadan ? 'ramadan' : 'sunnah');
  };

  const handleLogMissed = () => {
    hub.addMissedFast({
      dateKey: hub.todayKey,
      reason: 'other',
    });
    setShowMissedForm(false);
  };

  const rulingCitations = mergeReferences(
    ...SEHRI_IFTAR_RULINGS.map((r) => r.citations),
    ...QADA_RULINGS.map((r) => r.citations),
  );

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: insets.bottom + layout.blockGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bodySm" color="secondary">
          {t('fasting.subtitle')}
        </Text>

        {hub.isRamadan ? (
          <Pressable onPress={() => navigation.navigate('RamadanHub')}>
            <Text variant="caption" color="accent">
              {t('fasting.ramadanHub')} ›
            </Text>
          </Pressable>
        ) : null}

        <SehriIftarCountdown countdown={hub.countdown} formatTime={hub.formatTime} />

        <Card variant="inset">
          <Text variant="overline" color="secondary">
            {t('fasting.tracker.title')}
          </Text>
          <View style={styles.trackerRow}>
            <Button
              label={
                hub.isFasted()
                  ? t('fasting.tracker.unmarkToday')
                  : t('fasting.tracker.markToday')
              }
              onPress={handleToggleToday}
            />
            <Pressable onPress={() => setShowMissedForm((v) => !v)}>
              <Text variant="caption" color="accent">
                {t('fasting.missed.log')}
              </Text>
            </Pressable>
          </View>
          {showMissedForm ? (
            <Button
              label={t('fasting.missed.logToday')}
              variant="secondary"
              onPress={handleLogMissed}
              style={styles.missedBtn}
            />
          ) : null}
        </Card>

        {hub.isRamadan ? (
          <Card variant="inset">
            <RamadanProgressRing progress={hub.progress} />
            <FastDayCalendar
              days={hub.progress.calendar}
              onDayPress={(day) => hub.toggleFastForDate(day.dateKey, 'ramadan')}
            />
          </Card>
        ) : null}

        <Card variant="inset">
          <Text variant="overline" color="secondary">
            {t('fasting.missed.title')}
          </Text>
          <MissedFastList
            items={hub.missed}
            onMarkQada={hub.markQadaComplete}
            onRemove={hub.removeMissedFast}
          />
        </Card>

        <Card variant="inset" style={styles.tools}>
          <Text variant="overline" color="secondary">
            {t('fasting.tools.title')}
          </Text>
          <Button
            label={t('fasting.kaffara.title')}
            variant="secondary"
            onPress={() => navigation.navigate('KaffaraCalculator')}
          />
          <Button
            label={t('fasting.fidya.title')}
            variant="secondary"
            onPress={() => navigation.navigate('FidyaCalculator')}
          />
        </Card>

        <FiqhDisclaimerBanner />
        <ReferenceList references={rulingCitations} titleKey="references.sourcesUsed" compact />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: layout.sectionGap,
    paddingTop: layout.blockGap,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: layout.listGap,
    gap: layout.blockGap,
  },
  missedBtn: {
    marginTop: layout.listGap,
  },
  tools: {
    gap: layout.blockGap,
  },
});

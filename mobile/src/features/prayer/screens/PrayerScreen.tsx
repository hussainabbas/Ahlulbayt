import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { analytics } from '@/core/analytics';
import type { PrayerTimeKey } from '@/core/prayer-engine';
import { useRootNavigation } from '@/navigation/hooks';
import { useLocale } from '@/i18n/useLocale';
import { useAdhanStore } from '@/stores/adhanStore';
import { PRAYER_METHODS } from '@/stores/prayerStore';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { usePrayerClockStore } from '../stores/prayerClockStore';
import {
  completionsForDate,
  usePrayerCompletionStore,
  type TrackablePrayer,
} from '../stores/prayerCompletionStore';

const TRACKABLE: TrackablePrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

type PrayerColorKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

const DISPLAY_ORDER: {
  key: PrayerTimeKey;
  labelKey: string;
  colorKey?: PrayerColorKey;
  trackable?: boolean;
}[] = [
  { key: 'fajr', labelKey: 'prayer.fajr', colorKey: 'fajr', trackable: true },
  { key: 'sunrise', labelKey: 'prayer.sunrise' },
  { key: 'dhuhr', labelKey: 'prayer.dhuhr', colorKey: 'dhuhr', trackable: true },
  { key: 'asr', labelKey: 'prayer.asr', colorKey: 'asr', trackable: true },
  { key: 'sunset', labelKey: 'prayer.sunset', colorKey: 'maghrib' },
  { key: 'maghrib', labelKey: 'prayer.maghrib', colorKey: 'maghrib', trackable: true },
  { key: 'isha', labelKey: 'prayer.isha', colorKey: 'isha', trackable: true },
];

export function PrayerScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const {
    times,
    nextPrayer,
    countdown,
    nextPrayerTime,
    formatTime,
    config,
    cityName,
  } = usePrayerTimes();
  const adhanEnabled = useAdhanStore((s) => s.masterEnabled);
  const togglePrayer = usePrayerCompletionStore((s) => s.togglePrayer);
  const dateKey = usePrayerClockStore((s) => s.dateKey);
  const completions = usePrayerCompletionStore((s) =>
    completionsForDate(s.byDate, dateKey),
  );

  const methodLabel = t(
    PRAYER_METHODS[config.method === 'custom' ? 'leva' : config.method]?.labelKey ??
      'prayer.methods.leva',
  );
  const subtitle = cityName ? `${methodLabel} · ${cityName}` : methodLabel;
  const nextLabel = t(`prayer.${nextPrayer.next}`);
  const nextColorKey = nextPrayer.next as PrayerColorKey;
  const nextColor =
    nextColorKey in theme.colors.prayer
      ? theme.colors.prayer[nextColorKey]
      : theme.colors.accentPrimary;

  return (
    <Screen scroll padded={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="displayMd">{t('prayer.title')}</Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        <View
          style={[
            styles.hero,
            getShadow('sm', theme.scheme),
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.lg,
            },
          ]}
        >
          <View style={[styles.heroAccent, { backgroundColor: nextColor }]} />
          <View style={styles.heroBody}>
            <Text variant="label" color="secondary">
              {t('home.nextPrayer')}
            </Text>
            <View style={styles.heroMain}>
              <Text variant="displayMd" style={styles.countdown}>
                {countdown}
              </Text>
              <View
                style={[
                  styles.heroBadge,
                  {
                    backgroundColor: `${nextColor}18`,
                    borderColor: `${nextColor}44`,
                  },
                ]}
              >
                <View style={[styles.heroDot, { backgroundColor: nextColor }]} />
                <Text variant="headingSm" style={{ color: nextColor }}>
                  {nextLabel}
                </Text>
              </View>
            </View>
            <Text variant="bodySm" color="secondary">
              {t('home.prayerAt', { prayer: nextLabel, time: nextPrayerTime })}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => rootNavigation.navigate('Settings')}
          style={[
            styles.adhanBanner,
            {
              backgroundColor: adhanEnabled
                ? theme.colors.accentPrimaryMuted
                : theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Text variant="bodySm" color={adhanEnabled ? 'accent' : 'secondary'} style={{ flex: 1 }}>
            {adhanEnabled ? t('adhan.enabledBanner') : t('adhan.disabledBanner')}
          </Text>
          <Icon name="chevron" size={14} color={theme.colors.textTertiary} />
        </Pressable>

        <Pressable
          onPress={() => rootNavigation.navigate('WorshipGuide')}
          style={[
            styles.adhanBanner,
            {
              backgroundColor: theme.colors.accentPrimaryMuted,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="bodySm" weight="600" color="accent">
              {t('worshipGuide.title')}
            </Text>
            <Text variant="caption" color="secondary">
              {t('worshipGuide.subtitle')}
            </Text>
          </View>
          <Icon name="book" size={18} color={theme.colors.accentPrimary} />
        </Pressable>

        <Pressable
          onPress={() => rootNavigation.navigate('PrayerAcademy')}
          style={[
            styles.adhanBanner,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="bodySm" weight="600">
              {t('prayerAcademy.title')}
            </Text>
            <Text variant="caption" color="secondary">
              {t('prayerAcademy.subtitle')}
            </Text>
          </View>
          <Icon name="book" size={18} color={theme.colors.accentPrimary} />
        </Pressable>

        <View style={styles.progressRow}>
          <Text variant="caption" color="secondary">
            {t('prayer.completionProgress', { done: completions.length, total: 5 })}
          </Text>
          <View style={styles.progressDots}>
            {TRACKABLE.map((prayer) => {
              const done = completions.includes(prayer);
              const color = theme.colors.prayer[prayer];
              return (
                <View
                  key={prayer}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: done ? color : theme.colors.surfaceMuted,
                      borderColor: done ? color : theme.colors.borderSubtle,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Card padded={false} style={styles.scheduleCard}>
          {DISPLAY_ORDER.map((item, index) => {
            const isNext = nextPrayer.next === item.key;
            const isCurrent = nextPrayer.current === item.key;
            const prayerKey = item.trackable ? (item.key as TrackablePrayer) : null;
            const done = prayerKey ? completions.includes(prayerKey) : false;
            const stripeColor =
              item.colorKey != null ? theme.colors.prayer[item.colorKey] : theme.colors.borderSubtle;

            return (
              <View
                key={item.key}
                style={[
                  styles.row,
                  index < DISPLAY_ORDER.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme.colors.borderSubtle,
                  },
                  isNext && {
                    backgroundColor: `${stripeColor}12`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.stripe,
                    {
                      backgroundColor: stripeColor,
                      width: isNext ? 4 : 3,
                    },
                  ]}
                />
                <View style={styles.rowBody}>
                  <View style={styles.rowStart}>
                    <Text variant="bodyMd" weight={isNext ? '600' : '500'}>
                      {t(item.labelKey)}
                    </Text>
                    {isNext ? (
                      <View
                        style={[
                          styles.statusPill,
                          { backgroundColor: `${stripeColor}22` },
                        ]}
                      >
                        <Text variant="caption" style={{ color: stripeColor }} weight="600">
                          {t('prayer.next')}
                        </Text>
                      </View>
                    ) : isCurrent ? (
                      <Text variant="caption" color="tertiary">
                        {t('prayer.current')}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.rowEnd}>
                    <Text
                      variant="headingSm"
                      weight={isNext ? '600' : '500'}
                      style={[styles.time, isNext && { color: stripeColor }]}
                    >
                      {formatTime(times[item.key])}
                    </Text>
                    {prayerKey ? (
                      <Pressable
                        onPress={() => {
                          const marked = togglePrayer(prayerKey);
                          if (marked) analytics.trackPrayerCompleted(prayerKey);
                        }}
                        hitSlop={8}
                        style={[
                          styles.checkButton,
                          {
                            borderColor: done ? stripeColor : theme.colors.borderSubtle,
                            backgroundColor: done ? `${stripeColor}22` : 'transparent',
                          },
                        ]}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: done }}
                        accessibilityLabel={t('prayer.markComplete', {
                          prayer: t(item.labelKey),
                        })}
                      >
                        {done ? <Icon name="check" size={14} color={stripeColor} /> : null}
                      </Pressable>
                    ) : (
                      <View style={styles.checkSpacer} />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </Card>

        <Card variant="inset" padded={false} style={styles.metaCard}>
          <MetaRow label={t('prayer.imsak')} value={formatTime(times.imsak)} />
          <MetaRow label={t('prayer.midnight')} value={formatTime(times.midnight)} />
          <MetaRow label={t('prayer.timezone')} value={times.timezone} isLast />
        </Card>
      </View>
    </Screen>
  );
}

function MetaRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.metaRow,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text variant="caption" color="secondary">
        {label}
      </Text>
      <Text variant="caption" color="tertiary" style={styles.metaValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.sectionGap,
    gap: layout.blockGap,
  },
  header: {
    gap: 4,
  },
  hero: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  heroAccent: {
    width: 4,
  },
  heroBody: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.listGap,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
  },
  countdown: {
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  adhanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.blockGap + 4,
    paddingVertical: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
    paddingHorizontal: 2,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scheduleCard: {
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    minHeight: 58,
  },
  stripe: {
    borderRadius: 1,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.blockGap + 4,
    paddingVertical: 12,
    gap: layout.blockGap,
  },
  rowStart: {
    flex: 1,
    gap: 4,
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSpacer: {
    width: 30,
  },
  time: {
    fontVariant: ['tabular-nums'],
    minWidth: 72,
    textAlign: 'right',
  },
  metaCard: {
    marginTop: layout.listGap,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.blockGap,
    gap: layout.blockGap,
  },
  metaValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
});

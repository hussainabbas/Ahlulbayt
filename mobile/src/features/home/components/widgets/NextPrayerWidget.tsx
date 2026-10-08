import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { MainTabParamList } from '@/navigation/types';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { getShadow } from '@/theme/shadows';
import { useTheme } from '@/theme/ThemeContext';

import type { NextPrayerInfo, PrayerName } from '../../types';

interface NextPrayerWidgetProps {
  nextPrayer: NextPrayerInfo;
  countdown: string;
  nextPrayerTime: string;
  timezone?: string;
}

export function NextPrayerWidget({
  nextPrayer,
  countdown,
  nextPrayerTime,
  timezone,
}: NextPrayerWidgetProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const prayerColor = theme.colors.prayer[nextPrayer.next];
  const prayerLabel = t(`prayer.${nextPrayer.next}`);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <Pressable
      onPress={() => navigation.navigate('Prayer')}
      style={({ pressed }) => [
        styles.wrapper,
        getShadow('sm', theme.scheme),
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t('home.nextPrayer')}
    >
      <View style={[styles.accent, { backgroundColor: prayerColor }]} />

      <View style={styles.content}>
        <View style={styles.hero}>
          <Text variant="label" color="secondary">
            {t('home.nextPrayer')}
          </Text>

          <View style={styles.countdownRow}>
            <Text variant="displayLg" style={styles.countdown}>
              {countdown}
            </Text>
            <View
              style={[
                styles.prayerBadge,
                {
                  backgroundColor: `${prayerColor}20`,
                  borderColor: `${prayerColor}55`,
                },
              ]}
            >
              <View style={[styles.prayerDot, { backgroundColor: prayerColor }]} />
              <Text variant="headingSm" style={{ color: prayerColor }}>
                {prayerLabel}
              </Text>
            </View>
          </View>

          <Text variant="bodySm" color="secondary">
            {t('home.prayerAt', {
              prayer: prayerLabel,
              time: nextPrayerTime,
            })}
          </Text>
        </View>

        <PrayerTimeline
          prayers={nextPrayer.all}
          current={nextPrayer.next}
          timezone={timezone}
        />
      </View>
    </Pressable>
  );
}

function PrayerTimeline({
  prayers,
  current,
  timezone,
}: {
  prayers: { name: PrayerName; time: Date }[];
  current: PrayerName;
  timezone?: string;
}) {
  const { theme } = useTheme();
  const { t, locale } = useLocale();

  return (
    <View style={[styles.timeline, { borderTopColor: theme.colors.borderSubtle }]}>
      {prayers.map((p) => {
        const active = p.name === current;
        const color = theme.colors.prayer[p.name];
        const timeLabel = p.time.toLocaleTimeString(locale, {
          hour: 'numeric',
          minute: '2-digit',
          ...(timezone ? { timeZone: timezone } : {}),
        });

        return (
          <View
            key={p.name}
            style={[
              styles.timelineItem,
              active && {
                backgroundColor: `${color}14`,
                borderColor: `${color}40`,
              },
            ]}
          >
            <Text
              variant="caption"
              color={active ? 'primary' : 'tertiary'}
              weight={active ? '600' : '500'}
              numberOfLines={1}
              style={styles.timelineName}
            >
              {t(`prayer.${p.name}`)}
            </Text>
            <Text
              variant="caption"
              weight={active ? '600' : '400'}
              style={[
                styles.timelineTime,
                { color: active ? color : theme.colors.textTertiary },
              ]}
            >
              {timeLabel}
            </Text>
            {active ? (
              <View style={[styles.timelineActiveBar, { backgroundColor: color }]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap + 4,
  },
  hero: {
    gap: layout.listGap,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
    marginTop: 2,
  },
  countdown: {
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  prayerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  prayerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timeline: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: layout.blockGap,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  timelineItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    minWidth: 0,
  },
  timelineName: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
  },
  timelineTime: {
    fontVariant: ['tabular-nums'],
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  timelineActiveBar: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

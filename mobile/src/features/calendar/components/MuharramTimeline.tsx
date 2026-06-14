import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_COLORS } from '../constants/categories';
import type { ShiaCalendarEvent } from '../types';

interface MuharramTimelineProps {
  events: ShiaCalendarEvent[];
  currentDay: number;
  onEventPress: (event: ShiaCalendarEvent) => void;
}

export function MuharramTimeline({ events, currentDay, onEventPress }: MuharramTimelineProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={['#3D1515', '#2A0E0E', '#1A0808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: theme.radius.lg }]}
    >
      <Text variant="overline" style={{ color: '#D4A0A0' }}>
        {t('calendar.muharramTimeline')}
      </Text>
      <Text variant="headingSm" style={{ color: '#F2E8E8', marginTop: 4 }}>
        {t('calendar.muharramSubtitle')}
      </Text>

      <View style={styles.timeline}>
        {events.map((event, index) => {
          const isPast = currentDay > event.hijriDay;
          const isCurrent = currentDay === event.hijriDay;
          const isAshura = event.id === 'ashura';

          return (
            <View key={event.id} style={styles.step}>
              <View style={styles.rail}>
                <View
                  style={[
                    styles.node,
                    {
                      backgroundColor: isCurrent
                        ? CATEGORY_COLORS.muharram
                        : isPast
                          ? '#6B4040'
                          : '#3A2525',
                      borderColor: isAshura ? '#D4B87A' : 'transparent',
                      borderWidth: isAshura ? 2 : 0,
                    },
                  ]}
                />
                {index < events.length - 1 ? (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: isPast ? '#6B4040' : '#3A2525' },
                    ]}
                  />
                ) : null}
              </View>
              <View style={styles.stepBody}>
                <Text variant="caption" style={{ color: '#B89090' }}>
                  {t('calendar.dayLabel', { day: event.hijriDay })}
                </Text>
                <Text
                  variant="bodySm"
                  weight={isCurrent ? '600' : '400'}
                  style={{ color: isCurrent ? '#F2E8E8' : '#C8A8A8' }}
                  onPress={() => onEventPress(event)}
                >
                  {t(event.titleKey)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(180,80,80,0.25)',
  },
  timeline: {
    marginTop: 16,
    gap: 0,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
  },
  rail: {
    width: 16,
    alignItems: 'center',
  },
  node: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 28,
    marginTop: 2,
  },
  stepBody: {
    flex: 1,
    paddingBottom: 12,
    gap: 2,
  },
});

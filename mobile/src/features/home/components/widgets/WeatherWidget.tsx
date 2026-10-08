import { Pressable, StyleSheet, View } from 'react-native';

import { WeatherSkeleton } from '@/components/feedback/skeletonPresets';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { WeatherInfo } from '../../types';
import { weatherEmoji } from '../../services/weatherApi';

interface WeatherWidgetProps {
  weather?: WeatherInfo;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function WeatherWidget({ weather, loading, error, onRetry }: WeatherWidgetProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  if (loading && !weather) {
    return <WeatherSkeleton />;
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="label" color="secondary">
        {t('home.weather')}
      </Text>

      {error && !weather ? (
        <View style={styles.errorWrap}>
          <Text variant="caption" color="secondary">
            {t('common.errorHint')}
          </Text>
          {onRetry ? (
            <Pressable onPress={onRetry} hitSlop={8}>
              <Text variant="caption" color="accent">
                {t('common.retry')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : weather ? (
        <View style={styles.row}>
          <Text variant="headingLg" style={styles.temp}>
            {weather.temperature}°
          </Text>
          <View style={styles.meta}>
            <Text variant="caption" color="secondary">
              {weatherEmoji(weather.conditionCode)} {t(`home.weatherConditions.${weather.condition}`)}
            </Text>
          </View>
        </View>
      ) : (
        <Text variant="bodySm" color="tertiary">
          —
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    padding: layout.blockGap + 4,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  row: {
    marginTop: 4,
    gap: 4,
  },
  temp: {
    fontVariant: ['tabular-nums'],
  },
  meta: {
    marginTop: 2,
  },
  errorWrap: {
    marginTop: 8,
    gap: 6,
  },
});

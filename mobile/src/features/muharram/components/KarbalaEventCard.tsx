import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MuharramDayContent } from '../types';

interface KarbalaEventCardProps {
  day: number;
  content: MuharramDayContent;
  onPress?: () => void;
}

export function KarbalaEventCard({ day, content, onPress }: KarbalaEventCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const inner = (
    <>
      <Text variant="overline" style={{ color: '#C49090' }}>
        {t('muharramMode.karbalaEvent')} · {t('muharramMode.dayLabel', { day })}
      </Text>
      <Text variant="headingMd" style={{ color: '#F0E0E0', marginTop: 8 }}>
        {t(content.karbalaEventKey)}
      </Text>
      <Text variant="bodySm" style={{ color: '#A88080', marginTop: 10, lineHeight: 22 }}>
        {t(content.karbalaDetailKey)}
      </Text>
      {onPress ? (
        <Text variant="caption" style={{ color: '#C49090', marginTop: 12 }}>
          {t('muharramModule.openDayDetail')}
        </Text>
      ) : null}
      <View style={styles.ornament}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
        ))}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}>
        <LinearGradient
          colors={['#2A1214', '#1A0A0C', '#0A0506']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: theme.radius.lg, borderColor: 'rgba(160,80,80,0.3)' }]}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <LinearGradient
      colors={['#2A1214', '#1A0A0C', '#0A0506']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderRadius: theme.radius.lg, borderColor: 'rgba(160,80,80,0.3)' }]}
    >
      {inner}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
    gap: 4,
  },
  ornament: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A05050',
  },
});

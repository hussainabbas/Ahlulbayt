import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface HubLink {
  key: string;
  title: string;
  subtitle: string;
  route: 'MuharramDayDetail' | 'KarbalaTimeline' | 'MartyrsList' | 'ArbaeenJourney' | 'SafarEvents' | 'Masoomeen';
  params?: { day?: number };
  accent?: string;
}

interface MuharramHubSectionProps {
  currentDay: number;
  onNavigate: (route: HubLink['route'], params?: HubLink['params']) => void;
}

export function MuharramHubSection({ currentDay, onNavigate }: MuharramHubSectionProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const links: HubLink[] = [
    {
      key: 'day',
      title: t('muharramModule.hub.dayDetail', { day: currentDay }),
      subtitle: t('muharramModule.hub.dayDetailSub'),
      route: 'MuharramDayDetail',
      params: { day: currentDay },
      accent: '#8B3A3A',
    },
    {
      key: 'timeline',
      title: t('muharramModule.hub.karbalaTimeline'),
      subtitle: t('muharramModule.hub.karbalaTimelineSub'),
      route: 'KarbalaTimeline',
      accent: '#6B3030',
    },
    {
      key: 'martyrs',
      title: t('muharramModule.hub.martyrs'),
      subtitle: t('muharramModule.hub.martyrsSub'),
      route: 'MartyrsList',
      accent: '#7A4040',
    },
    {
      key: 'ahlulbayt',
      title: t('muharramModule.hub.ahlulBayt'),
      subtitle: t('muharramModule.hub.ahlulBaytSub'),
      route: 'Masoomeen',
      accent: '#5A6A8A',
    },
    {
      key: 'arbaeen',
      title: t('muharramModule.hub.arbaeen'),
      subtitle: t('muharramModule.hub.arbaeenSub'),
      route: 'ArbaeenJourney',
      accent: '#4A5A6A',
    },
    {
      key: 'safar',
      title: t('muharramModule.hub.safar'),
      subtitle: t('muharramModule.hub.safarSub'),
      route: 'SafarEvents',
      accent: '#3A4A5A',
    },
  ];

  return (
    <View style={styles.grid}>
      {links.map((link) => (
        <Pressable
          key={link.key}
          onPress={() => onNavigate(link.route, link.params)}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <Card style={styles.card}>
            <View style={[styles.accent, { backgroundColor: link.accent ?? theme.colors.accentGold }]} />
            <View style={styles.body}>
              <Text variant="headingSm">{link.title}</Text>
              <Text variant="bodySm" color="secondary" numberOfLines={2}>
                {link.subtitle}
              </Text>
              <View style={styles.chevron}>
                <Icon name="chevron" size={14} color={theme.colors.accentPrimary} />
              </View>
            </View>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  accent: {
    width: 3,
  },
  body: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  chevron: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});

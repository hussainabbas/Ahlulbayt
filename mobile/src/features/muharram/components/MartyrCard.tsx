import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MartyrProfile } from '../types';
import { pickLocalizedText } from '../utils/localize';

interface MartyrCardProps {
  martyr: MartyrProfile;
  onPress: () => void;
}

export function MartyrCard({ martyr, onPress }: MartyrCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();

  const name = pickLocalizedText(martyr.name, locale);
  const honorific = martyr.honorific ? pickLocalizedText(martyr.honorific, locale) : '';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titles}>
            <Text variant="headingSm">
              {name} {honorific}
            </Text>
            <Text variant="bodySm" color="secondary">
              {pickLocalizedText(martyr.role, locale)}
            </Text>
          </View>
          <Icon name="chevron" size={16} color={theme.colors.accentPrimary} />
        </View>
        <Text variant="caption" color="tertiary">
          {t('muharramModule.martyrs.shahadatDay', { day: martyr.shahadatDay })}
        </Text>
        <Text variant="bodySm" color="secondary" numberOfLines={2} style={styles.preview}>
          {pickLocalizedText(martyr.narrative, locale)}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  preview: {
    marginTop: 4,
    lineHeight: 20,
  },
});

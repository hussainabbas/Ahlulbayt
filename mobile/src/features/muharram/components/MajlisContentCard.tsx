import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';

import type { MuharramDayContent } from '../types';

interface MajlisContentCardProps {
  content: MuharramDayContent;
}

export function MajlisContentCard({ content }: MajlisContentCardProps) {
  const { t } = useLocale();

  return (
    <Card>
      <View style={styles.header}>
        <Text variant="overline" color="accent">
          {t('muharramMode.majlis')}
        </Text>
        <View style={styles.themePill}>
          <Text variant="caption" color="secondary">
            {t(content.majlisThemeKey)}
          </Text>
        </View>
      </View>
      <Text variant="headingSm" style={{ marginTop: 10 }}>
        {t(content.majlisTitleKey)}
      </Text>
      <Text variant="bodyMd" color="secondary" style={styles.body}>
        {t(content.majlisBodyKey)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  themePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 69, 69, 0.12)',
  },
  body: {
    marginTop: 12,
    lineHeight: 24,
  },
});

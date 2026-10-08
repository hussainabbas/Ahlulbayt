import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MuharramDayContent } from '../types';

interface DailyAmalCardProps {
  content: MuharramDayContent;
  onOpenDua?: () => void;
}

export function DailyAmalCard({ content, onOpenDua }: DailyAmalCardProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <Card>
      <Text variant="overline" color="accent">
        {t('muharramMode.dailyAmal')}
      </Text>
      <Text variant="headingSm" style={{ marginTop: 8 }}>
        {t(content.amalTitleKey)}
      </Text>
      <Text variant="bodySm" color="secondary" style={{ marginTop: 6, lineHeight: 22 }}>
        {t(content.amalBodyKey)}
      </Text>
      <View style={[styles.stepsBox, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Text variant="bodySm" color="primary" style={{ lineHeight: 22 }}>
          {t(content.amalStepsKey)}
        </Text>
      </View>
      {content.duaId && onOpenDua ? (
        <Pressable
          onPress={onOpenDua}
          style={[styles.cta, { backgroundColor: theme.colors.accentPrimaryMuted }]}
        >
          <Text variant="bodySm" color="accent">
            {t('muharramMode.openDua')} ›
          </Text>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  stepsBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
  },
  cta: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
});

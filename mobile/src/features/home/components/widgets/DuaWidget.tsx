import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { DashboardWidget } from '../DashboardWidget';
import type { DailyDua } from '../../types';

interface DuaWidgetProps {
  dua: DailyDua;
}

export function DuaWidget({ dua }: DuaWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <DashboardWidget label={t('home.dua')} accentColor={theme.colors.accentPrimary}>
      <Text variant="headingSm">{dua.title}</Text>
      <Text
        variant="bodyMd"
        style={[styles.arabic, { color: theme.colors.textPrimary, textAlign: 'right' }]}
      >
        {dua.arabic}
      </Text>
      <Text variant="bodySm" color="secondary">
        {dua.translation}
      </Text>
      <View style={[styles.benefit, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text variant="caption" color="accent">
          {dua.benefit}
        </Text>
      </View>
    </DashboardWidget>
  );
}

const styles = StyleSheet.create({
  arabic: {
    lineHeight: 30,
    writingDirection: 'rtl',
  },
  benefit: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});

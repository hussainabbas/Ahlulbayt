import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { CitationList } from './CitationList';
import type { RamadanDayEntry } from '../types';

interface RamadanDailyWidgetProps {
  daily: RamadanDayEntry;
}

export function RamadanDailyWidget({ daily }: RamadanDailyWidgetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  const openDua = () => {
    if (daily.dua.duaId) {
      rootNavigation.navigate('DuaReader', { duaId: daily.dua.duaId });
    } else if (daily.dua.sahifaId) {
      rootNavigation.navigate('SahifaReader', { sahifaId: daily.dua.sahifaId });
    }
  };

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
      <View style={[styles.accent, { backgroundColor: theme.colors.prayer.maghrib }]} />
      <View style={styles.body}>
        <Text variant="label" color="secondary">
          {t('home.ramadan.day', { day: daily.day })} — {daily.theme.en}
        </Text>

        <Pressable onPress={openDua} disabled={!daily.dua.duaId && !daily.dua.sahifaId}>
          <Text variant="headingSm">{daily.dua.title.en}</Text>
          <Text variant="bodySm" color="secondary">
            {daily.dua.translation.en}
          </Text>
          {daily.dua.duaId || daily.dua.sahifaId ? (
            <Text variant="caption" color="accent">
              {t('ramadanMode.openReader')} ›
            </Text>
          ) : null}
          <CitationList citations={daily.dua.citations} compact />
        </Pressable>

        <View style={[styles.divider, { borderTopColor: theme.colors.borderSubtle }]} />

        <Text variant="headingSm">{t('home.ramadan.hadith')}</Text>
        <Text variant="bodySm" color="secondary">
          {daily.hadith.text.en}
        </Text>
        {daily.hadith.narrator ? (
          <Text variant="caption" color="tertiary">
            — {daily.hadith.narrator.en}
          </Text>
        ) : null}
        <CitationList citations={daily.hadith.citations} compact />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  accent: { width: 3 },
  body: {
    flex: 1,
    padding: layout.screenPaddingX,
    gap: layout.blockGap,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
});

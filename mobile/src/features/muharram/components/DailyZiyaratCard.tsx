import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { getZiyaratMeta } from '@/features/ziyarat/constants/catalog';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { MuharramDayContent } from '../types';

interface DailyZiyaratCardProps {
  content: MuharramDayContent;
  onOpen: () => void;
}

export function DailyZiyaratCard({ content, onOpen }: DailyZiyaratCardProps) {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const meta = getZiyaratMeta(content.ziyaratId);
  const title =
    meta == null
      ? content.ziyaratId
      : locale === 'ur'
        ? meta.titles.ur
        : locale === 'ar'
          ? meta.titles.ar
          : meta.titles.en;

  return (
    <Card>
      <Text variant="overline" color="accent">
        {t('muharramMode.dailyZiyarat')}
      </Text>
      <Text variant="headingSm" style={{ marginTop: 8 }}>
        {title}
      </Text>
      {meta ? (
        <Text variant="bodySm" color="secondary" style={{ marginTop: 6 }} numberOfLines={2}>
          {locale === 'ur' ? meta.subtitles.ur : meta.subtitles.en}
        </Text>
      ) : null}
      <Pressable
        onPress={onOpen}
        style={[styles.cta, { backgroundColor: theme.colors.accentPrimaryMuted }]}
      >
        <Text variant="bodySm" color="accent">
          {t('muharramMode.openZiyarat')} ›
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
});

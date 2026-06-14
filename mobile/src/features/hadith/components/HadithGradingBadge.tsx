import { Share, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { GRADING_LABEL_KEYS } from '../constants/catalog';
import type { HadithGrading } from '../types';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

const GRADING_COLORS: Record<HadithGrading, string> = {
  sahih: '#2E7D5A',
  hasan: '#3D7A6A',
  muwaththaq: '#4A6A8A',
  daif: '#8A7A4A',
  mawdu: '#8A4A4A',
  unknown: '#6A6A6A',
};

interface HadithGradingBadgeProps {
  grading: HadithGrading;
}

export function HadithGradingBadge({ grading }: HadithGradingBadgeProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const color = GRADING_COLORS[grading];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}44` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text variant="caption" weight="600" style={{ color }}>
        {t(GRADING_LABEL_KEYS[grading])}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

export async function shareHadithText(params: {
  title: string;
  text: string;
  arabic?: string;
  source: string;
  reference?: string;
}): Promise<void> {
  const lines = [
    params.arabic,
    `"${params.text}"`,
    `— ${params.title}`,
    params.reference ? `${params.source} · ${params.reference}` : params.source,
    '\nShared via AhlulBayt+',
  ].filter(Boolean);

  await Share.share({ message: lines.join('\n\n') });
}

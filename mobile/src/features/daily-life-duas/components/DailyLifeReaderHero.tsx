import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { SITUATION_ICONS } from '../constants/categoryVisuals';
import type { DailyLifeDuaMeta } from '../types';
import { getMetaDescription } from '../utils/localizedContent';

interface DailyLifeReaderHeroProps {
  meta: DailyLifeDuaMeta;
  verified: boolean;
}

export function DailyLifeReaderHero({ meta, verified }: DailyLifeReaderHeroProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const situationIcon = SITUATION_ICONS[meta.situationKey] ?? '✦';

  return (
    <LinearGradient
      colors={['rgba(31, 92, 82, 0.12)', 'rgba(184, 149, 107, 0.08)', theme.colors.backgroundPrimary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.wrap,
        {
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
        <Text style={styles.icon}>{situationIcon}</Text>
      </View>

      <View style={styles.textCol}>
        <Text variant="bodySm" color="secondary">
          {getMetaDescription(meta, locale)}
        </Text>
        {verified ? (
          <View style={[styles.verifiedPill, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
            <Text variant="caption" color="accent" weight="600">
              {t('dailyLifeDuas.verifiedSource')}
            </Text>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: layout.blockGap + 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textCol: {
    flex: 1,
    gap: 8,
  },
  verifiedPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});

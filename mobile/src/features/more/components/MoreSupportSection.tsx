import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { trackSupportOptionClick } from '@/features/support/services/supportAnalytics';

const MORE_SUPPORT_OPTIONS = [
  { id: 'coffee', icon: '☕', titleKey: 'support.options.coffee.title' },
  { id: 'one_time', icon: '💚', titleKey: 'support.options.oneTime.title' },
  { id: 'monthly', icon: '⭐', titleKey: 'support.options.monthly.title' },
  { id: 'founding', icon: '🏆', titleKey: 'support.options.founding.title' },
] as const;

export function MoreSupportSection() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();

  const openOption = useCallback(
    (optionId: string) => {
      trackSupportOptionClick(optionId);
      rootNavigation.navigate('SupportCrypto', { optionId });
    },
    [rootNavigation],
  );

  return (
    <View style={styles.section}>
      <Text variant="caption" color="tertiary" weight="600" style={styles.heading}>
        {t('support.moreSection.title')}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        {MORE_SUPPORT_OPTIONS.map((option, index) => (
          <ListRow
            key={option.id}
            title={t(option.titleKey)}
            onPress={() => openOption(option.id)}
            isLast={index === MORE_SUPPORT_OPTIONS.length - 1}
            leading={
              <Text variant="headingMd" style={{ width: 28, textAlign: 'center' }}>
                {option.icon}
              </Text>
            }
            accentColor={theme.colors.accentPrimary}
          />
        ))}
        <ListRow
          title={t('support.hub.title')}
          subtitle={t('support.moreSection.viewAll')}
          onPress={() => rootNavigation.navigate('Support')}
          isLast
          leading={
            <Text variant="headingMd" style={{ width: 28, textAlign: 'center' }}>
              💚
            </Text>
          }
          accentColor={theme.colors.accentPrimary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  heading: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});

import { useRootNavigation } from '@/navigation/hooks';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuthStore } from '@/stores/authStore';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

const ITEMS = [
  { key: 'insights', route: 'Insights' as const },
  { key: 'premium', route: 'Paywall' as const },
  { key: 'mafatih', route: 'Mafatih' as const },
  { key: 'sahifa', route: 'Sahifa' as const },
  { key: 'masoomeen', route: 'Masoomeen' as const },
  { key: 'hadith', route: 'Hadith' as const },
  { key: 'tasbih', route: 'Tasbih' as const },
  { key: 'nahjul', route: 'Nahjul' as const },
  { key: 'dua', route: 'Duas' as const },
  { key: 'ziyarat', route: 'Ziyarat' as const },
  { key: 'muharram', route: 'MuharramMode' as const },
  { key: 'calendar', route: 'Calendar' as const },
  { key: 'qibla', route: 'Qibla' as const },
] as const;

export function MoreScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const displayName = useAuthStore((s) => s.user?.displayName);
  const email = useAuthStore((s) => s.user?.email);

  return (
    <Screen scroll>
      <ScreenHeader
        title={displayName ?? t('tabs.profile')}
        subtitle={email ?? t('more.subtitle')}
      />

      <Card padded={false} style={styles.menuCard}>
        {ITEMS.map((item, index) => (
          <ListRow
            key={item.key}
            title={t(`more.${item.key}`)}
            onPress={() => rootNavigation.navigate(item.route)}
            isLast={index === ITEMS.length - 1}
          />
        ))}
      </Card>

      <ListRow
        title={t('common.settings')}
        onPress={() => rootNavigation.navigate('Settings')}
        style={[
          styles.settingsRow,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: theme.radius.lg,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.borderSubtle,
            marginTop: layout.sectionGap,
          },
        ]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    marginTop: layout.listGap,
  },
  settingsRow: {
    paddingHorizontal: layout.screenPaddingX,
  },
});

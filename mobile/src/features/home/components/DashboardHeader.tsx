import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useRootNavigation } from '@/navigation/hooks';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface DashboardHeaderProps {
  greeting: string;
  name?: string | null;
  city?: string | null;
  locationLoading?: boolean;
}

export function DashboardHeader({
  greeting,
  name,
  city,
  locationLoading = false,
}: DashboardHeaderProps) {
  const { theme } = useTheme();
  const rootNavigation = useRootNavigation();
  const firstName = name?.split(' ')[0];

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        {!locationLoading ? (
          <Text variant="caption" color="tertiary" numberOfLines={1} style={styles.city}>
            {city ?? 'AhlulBayt+'}
          </Text>
        ) : (
          <View style={[styles.cityPlaceholder, { backgroundColor: theme.colors.surfaceMuted }]} />
        )}

        <Pressable
          onPress={() => rootNavigation.navigate('Settings')}
          style={({ pressed }) => [
            styles.settingsBtn,
            {
              backgroundColor: theme.colors.surfaceMuted,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={8}
        >
          <Icon name="settings" size={18} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <Text variant="displayMd" style={styles.greeting}>
          {greeting}
        </Text>
        {firstName ? (
          <Text variant="headingLg" color="secondary" style={styles.name}>
            {firstName}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: layout.listGap,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.blockGap,
  },
  city: {
    flex: 1,
    letterSpacing: 0.2,
  },
  cityPlaceholder: {
    flex: 1,
    maxWidth: 140,
    height: 10,
    borderRadius: 4,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingBlock: {
    gap: 2,
  },
  greeting: {
    lineHeight: 32,
  },
  name: {
    lineHeight: 26,
  },
});

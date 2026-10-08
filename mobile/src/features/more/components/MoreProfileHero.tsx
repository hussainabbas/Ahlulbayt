import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface MoreProfileHeroProps {
  displayName: string;
  email?: string | null;
  isGuest: boolean;
  onSignIn: () => void;
  onSettings: () => void;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  return `${parts[0]!.slice(0, 1)}${parts[parts.length - 1]!.slice(0, 1)}`.toUpperCase();
}

export function MoreProfileHero({
  displayName,
  email,
  isGuest,
  onSignIn,
  onSettings,
}: MoreProfileHeroProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={['rgba(61, 155, 138, 0.14)', 'rgba(212, 184, 122, 0.1)', theme.colors.surfaceElevated]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        {
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.accentPrimary }]}>
          <Text variant="headingSm" style={{ color: theme.colors.textInverse }}>
            {initials(displayName)}
          </Text>
        </View>

        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <Text variant="headingMd" weight="600" numberOfLines={1}>
              {displayName}
            </Text>
            {isGuest ? (
              <View style={[styles.guestPill, { backgroundColor: theme.colors.surfaceMuted }]}>
                <Text variant="caption" color="secondary" weight="600">
                  {t('more.guestBadge')}
                </Text>
              </View>
            ) : null}
          </View>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {email ?? t('more.subtitle')}
          </Text>
        </View>

        <Pressable
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel={t('common.settings')}
          style={({ pressed }) => [
            styles.settingsBtn,
            {
              backgroundColor: theme.colors.surfaceElevated,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Icon name="settings" size={18} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {isGuest ? (
        <View style={styles.guestRow}>
          <Text variant="caption" color="tertiary" style={styles.guestNote}>
            {t('auth.welcome.guestNote')}
          </Text>
          <Pressable
            onPress={onSignIn}
            style={({ pressed }) => [
              styles.signInBtn,
              {
                backgroundColor: theme.colors.accentPrimary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text variant="bodySm" weight="600" style={{ color: theme.colors.textInverse }}>
              {t('more.signIn')}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
    gap: layout.blockGap,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  identity: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  guestRow: {
    gap: 10,
  },
  guestNote: {
    lineHeight: 18,
  },
  signInBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { env } from '@/core/config/env';
import { isGoogleSignInConfigured } from '@/core/config/google';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';
import type { AuthStackParamList } from '@/navigation/types';

import { AuthMethodButton } from '../components/AuthMethodButton';
import { useAuth } from '../hooks/useAuth';
import { useEnterApp } from '../hooks/useEnterApp';

export function AuthWelcomeScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading, error, continueAsGuest, loginWithGoogle, loginWithApple } = useAuth();
  const enterApp = useEnterApp();
  const googleReady = isGoogleSignInConfigured(env.googleWebClientId);

  const handleGuest = async () => {
    enterApp(await continueAsGuest());
  };

  const handleGoogle = async () => {
    enterApp(await loginWithGoogle());
  };

  const handleApple = async () => {
    enterApp(await loginWithApple());
  };

  return (
    <Screen scroll padded={false} safeTop={false} style={styles.root}>
      <LinearGradient
        colors={[
          'rgba(31, 92, 82, 0.22)',
          'rgba(184, 149, 107, 0.12)',
          theme.colors.backgroundPrimary,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={[styles.logoMark, { backgroundColor: theme.colors.accentPrimary }]}>
          <Text style={[styles.logoGlyph, { color: theme.colors.textInverse }]}>☪</Text>
        </View>
        <Text variant="displayMd" style={styles.brand}>
          AhlulBayt+
        </Text>
        <Text variant="bodyLg" color="secondary" style={styles.heroSubtitle}>
          {t('auth.welcome.subtitle')}
        </Text>
      </LinearGradient>

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <Text variant="headingSm" style={styles.sheetTitle}>
          {t('auth.welcome.title')}
        </Text>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: 'rgba(139, 58, 58, 0.08)' }]}>
            <Text variant="bodySm" style={{ color: theme.colors.error }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          {googleReady ? (
            <AuthMethodButton
              label={t('auth.welcome.google')}
              variant="google"
              loading={loading}
              onPress={() => void handleGoogle()}
            />
          ) : null}

          {Platform.OS === 'ios' ? (
            <AuthMethodButton
              label={t('auth.welcome.apple')}
              variant="apple"
              loading={loading}
              onPress={() => void handleApple()}
            />
          ) : null}

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderSubtle }]} />
            <Text variant="caption" color="tertiary">
              {t('auth.welcome.orEmail')}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderSubtle }]} />
          </View>

          <AuthMethodButton
            label={t('auth.welcome.emailLogin')}
            variant="email"
            onPress={() => navigation.navigate('Login')}
          />
          <AuthMethodButton
            label={t('auth.welcome.emailRegister')}
            variant="register"
            onPress={() => navigation.navigate('Register')}
          />
        </View>

        <Pressable
          onPress={() => void handleGuest()}
          disabled={loading}
          style={({ pressed }) => [styles.guestLink, pressed && { opacity: 0.75 }]}
        >
          <Text variant="bodyMd" color="accent" weight="600">
            {t('auth.welcome.guest')}
          </Text>
        </Pressable>

        <Text variant="caption" color="tertiary" style={styles.guestNote}>
          {t('auth.welcome.guestNote')}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 56,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoGlyph: {
    fontSize: 34,
    lineHeight: 40,
  },
  brand: {
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
  },
  sheet: {
    flex: 1,
    marginTop: -24,
    marginHorizontal: layout.screenPaddingX,
    paddingHorizontal: layout.blockGap + 4,
    paddingTop: layout.sectionGap,
    paddingBottom: layout.sectionGap,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
  },
  actions: {
    gap: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestNote: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Platform, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { useAuth } from '../hooks/useAuth';
import type { AuthStackParamList } from '@/navigation/types';

export function AuthWelcomeScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading, error, continueAsGuest, loginWithGoogle, loginWithApple } = useAuth();

  return (
    <Screen scroll style={styles.root}>
      <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing[6] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <Text variant="displayMd">{t('auth.welcome.title')}</Text>
          <Text variant="bodyLg" color="secondary">
            {t('auth.welcome.subtitle')}
          </Text>
        </View>

        {error ? (
          <Text variant="bodySm" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        ) : null}

        <View style={{ gap: theme.spacing[3] }}>
          <Button
            label={t('auth.welcome.emailLogin')}
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            label={t('auth.welcome.emailRegister')}
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
          <Button
            label={t('auth.welcome.google')}
            variant="secondary"
            loading={loading}
            onPress={() => void loginWithGoogle()}
          />
          {Platform.OS === 'ios' ? (
            <Button
              label={t('auth.welcome.apple')}
              variant="secondary"
              loading={loading}
              onPress={() => void loginWithApple()}
            />
          ) : null}
          <Button
            label={t('auth.welcome.guest')}
            variant="ghost"
            loading={loading}
            onPress={() => void continueAsGuest()}
          />
        </View>

        <Text variant="bodySm" color="tertiary" style={{ textAlign: 'center' }}>
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
});

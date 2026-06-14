import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import type { AuthStackParamList } from '@/navigation/types';

import { AuthInput } from '../components/AuthInput';
import { useAuth } from '../hooks/useAuth';

export function EmailLoginScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading, error, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    void login(email.trim(), password);
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: theme.spacing[4] }}>
        <Text variant="bodyMd" color="accent">
          {t('auth.back')}
        </Text>
      </Pressable>

      <View style={{ gap: theme.spacing[2], marginBottom: theme.spacing[6] }}>
        <Text variant="headingLg">{t('auth.login.title')}</Text>
        <Text variant="bodyMd" color="secondary">
          {t('auth.login.subtitle')}
        </Text>
      </View>

      <View style={styles.form}>
        <AuthInput
          label={t('auth.fields.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <AuthInput
          label={t('auth.fields.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
      </View>

      {error ? (
        <Text variant="bodySm" style={{ color: theme.colors.error, marginTop: theme.spacing[3] }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[3] }}>
        <Button label={t('auth.login.submit')} loading={loading} onPress={handleSubmit} />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text variant="bodyMd" color="accent" style={{ textAlign: 'center' }}>
            {t('auth.login.forgot')}
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('VerifyOtp', {})}>
          <Text variant="bodySm" color="secondary" style={{ textAlign: 'center' }}>
            {t('auth.login.otp')}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import type { AuthStackParamList } from '@/navigation/types';

import { AuthInput } from '../components/AuthInput';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading, error, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    const res = await forgotPassword(email.trim());
    if (res) setSent(true);
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: theme.spacing[4] }}>
        <Text variant="bodyMd" color="accent">
          {t('auth.back')}
        </Text>
      </Pressable>

      <View style={{ gap: theme.spacing[2], marginBottom: theme.spacing[6] }}>
        <Text variant="headingLg">{t('auth.forgot.title')}</Text>
        <Text variant="bodyMd" color="secondary">
          {sent ? t('auth.forgot.sent') : t('auth.forgot.subtitle')}
        </Text>
      </View>

      {!sent ? (
        <>
          <AuthInput
            label={t('auth.fields.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? (
            <Text variant="bodySm" style={{ color: theme.colors.error, marginTop: theme.spacing[3] }}>
              {error}
            </Text>
          ) : null}
          <View style={{ marginTop: theme.spacing[6] }}>
            <Button label={t('auth.forgot.send')} loading={loading} onPress={() => void handleSend()} />
          </View>
        </>
      ) : (
        <ForgotPasswordResetForm email={email.trim()} />
      )}
    </Screen>
  );
}

function ForgotPasswordResetForm({ email }: { email: string }) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading, error, resetPassword, sendOtp } = useAuth();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleReset = async () => {
    const res = await resetPassword(token.trim(), password);
    if (res) {
      navigation.replace('Login');
    }
  };

  return (
    <View style={{ gap: 16 }}>
      <AuthInput
        label={t('auth.forgot.resetToken')}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />
      <AuthInput
        label={t('auth.forgot.otp')}
        value={otpCode}
        onChangeText={setOtpCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <AuthInput
        label={t('auth.fields.newPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? (
        <Text variant="bodySm" style={{ color: theme.colors.error }}>
          {error}
        </Text>
      ) : null}
      <Button
        label={t('auth.forgot.resendOtp')}
        variant="ghost"
        onPress={() => void sendOtp(email, 'password_reset')}
      />
      <Button label={t('auth.forgot.reset')} loading={loading} onPress={() => void handleReset()} />
    </View>
  );
}

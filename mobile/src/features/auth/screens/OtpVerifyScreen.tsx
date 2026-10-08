import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
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
import { useEnterApp } from '../hooks/useEnterApp';
import type { OtpPurpose } from '../types';

export function OtpVerifyScreen() {
  const { theme } = useTheme();
  const { t } = useLocale();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'VerifyOtp'>>();
  const { loading, error, sendOtp, verifyOtp } = useAuth();
  const enterApp = useEnterApp();

  const [email, setEmail] = useState(route.params?.email ?? '');
  const [code, setCode] = useState('');
  const purpose = (route.params?.purpose as OtpPurpose | undefined) ?? 'login';

  const handleVerify = async () => {
    const res = await verifyOtp(email.trim(), code.trim(), purpose);
    if (res && 'verified' in res) {
      navigation.replace('Login');
      return;
    }
    enterApp(res);
  };

  return (
    <Screen scroll>
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: theme.spacing[4] }}>
        <Text variant="bodyMd" color="accent">
          {t('auth.back')}
        </Text>
      </Pressable>

      <View style={{ gap: theme.spacing[2], marginBottom: theme.spacing[6] }}>
        <Text variant="headingLg">{t('auth.otp.title')}</Text>
        <Text variant="bodyMd" color="secondary">
          {t('auth.otp.subtitle')}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        <AuthInput
          label={t('auth.fields.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AuthInput
          label={t('auth.otp.code')}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      {error ? (
        <Text variant="bodySm" style={{ color: theme.colors.error, marginTop: theme.spacing[3] }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[3] }}>
        <Button label={t('auth.otp.verify')} loading={loading} onPress={() => void handleVerify()} />
        <Button
          label={t('auth.otp.resend')}
          variant="ghost"
          onPress={() => void sendOtp(email.trim(), purpose)}
        />
      </View>
    </Screen>
  );
}

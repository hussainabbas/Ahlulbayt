import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, type ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthWelcomeScreen } from '@/features/auth/screens/AuthWelcomeScreen';
import { EmailLoginScreen } from '@/features/auth/screens/EmailLoginScreen';
import { EmailRegisterScreen } from '@/features/auth/screens/EmailRegisterScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { OtpVerifyScreen } from '@/features/auth/screens/OtpVerifyScreen';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/theme/ThemeContext';

import type { AuthStackParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  }, [isAuthenticated, navigation]);

  return <>{children}</>;
}

export function AuthNavigator() {
  const { theme } = useTheme();

  return (
    <AuthGate>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.backgroundPrimary },
        }}
      >
        <Stack.Screen name="Welcome" component={AuthWelcomeScreen} />
        <Stack.Screen name="Login" component={EmailLoginScreen} />
        <Stack.Screen name="Register" component={EmailRegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={OtpVerifyScreen} />
      </Stack.Navigator>
    </AuthGate>
  );
}

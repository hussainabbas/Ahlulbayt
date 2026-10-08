import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, type ReactNode } from 'react';

import { AuthWelcomeScreen } from '@/features/auth/screens/AuthWelcomeScreen';
import { EmailLoginScreen } from '@/features/auth/screens/EmailLoginScreen';
import { EmailRegisterScreen } from '@/features/auth/screens/EmailRegisterScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { OtpVerifyScreen } from '@/features/auth/screens/OtpVerifyScreen';
import { resetRootRoute } from '@/navigation/navigationRef';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/theme/ThemeContext';

import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isGuest = useAuthStore((s) => s.isGuest);

  useEffect(() => {
    // Signed-in users should not stay on the auth stack (guests can open it to upgrade).
    if (isAuthenticated && !isGuest) {
      resetRootRoute('Main');
    }
  }, [isAuthenticated, isGuest]);

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

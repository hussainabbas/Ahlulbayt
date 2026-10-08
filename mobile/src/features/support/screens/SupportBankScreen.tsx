import { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { BankDetailsCard } from '../components/BankDetailsCard';
import { useSupportConfig } from '../hooks/useSupportConfig';

export function SupportBankScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { config } = useSupportConfig();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('support.bank.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  useEffect(() => {
    if (!config.bankDetails) {
      navigation.goBack();
    }
  }, [config.bankDetails, navigation]);

  if (!config.bankDetails) {
    return null;
  }

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: insets.bottom + layout.blockGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bodySm" color="secondary">
          {t('support.bank.subtitle')}
        </Text>
        <BankDetailsCard details={config.bankDetails} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.blockGap,
    gap: layout.sectionGap,
  },
});

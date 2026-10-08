import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { useSupportConfig } from '../hooks/useSupportConfig';

const TRANSPARENCY_KEYS = ['hosting', 'notifications', 'ai', 'development'] as const;

export function SupportTransparencyScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { config } = useSupportConfig();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('support.transparency.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

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
          {t('support.transparency.subtitle')}
        </Text>

        <Card style={styles.list}>
          {TRANSPARENCY_KEYS.map((key) => (
            <View key={key} style={styles.row}>
              <Text variant="bodyMd" weight="600">
                {t(`support.transparency.${key}.title`)}
              </Text>
              <Text variant="bodySm" color="secondary">
                {config.transparency[key] ?? t(`support.transparency.${key}.default`)}
              </Text>
            </View>
          ))}
        </Card>

        <Text variant="caption" color="tertiary" style={styles.footer}>
          {t('support.transparency.footer')}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: layout.blockGap,
    gap: layout.sectionGap,
  },
  list: {
    gap: layout.blockGap,
  },
  row: {
    gap: 4,
  },
  footer: {
    lineHeight: 18,
  },
});

import { useCallback, useEffect, useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

import { SupportOptionRow } from '../components/SupportOptionRow';
import { useSupportConfig } from '../hooks/useSupportConfig';
import { trackSupportHubView, trackSupportOptionClick } from '../services/supportAnalytics';

export function SupportHubScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { config } = useSupportConfig();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('support.hub.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  useEffect(() => {
    trackSupportHubView();
  }, []);

  const openOption = useCallback(
    (optionId: string) => {
      trackSupportOptionClick(optionId);
      navigation.navigate('SupportCrypto', { optionId });
    },
    [navigation],
  );

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
          {t('support.hub.subtitle')}
        </Text>

        {config.campaign ? (
          <Card style={styles.campaign}>
            <Text variant="headingSm">{config.campaign.title}</Text>
            <Text variant="bodySm" color="secondary">
              {config.campaign.body}
            </Text>
          </Card>
        ) : null}

        <Card padded={false} style={styles.options}>
          {config.options.map((option, index) => (
            <SupportOptionRow
              key={option.id}
              option={option}
              onPress={() => openOption(option.id)}
              isLast={index === config.options.length - 1}
            />
          ))}
        </Card>

        <Pressable onPress={() => navigation.navigate('SupportTransparency')}>
          <Text variant="bodySm" color="accent" style={styles.transparencyLink}>
            {t('support.hub.transparencyLink')} ›
          </Text>
        </Pressable>

        <Text variant="caption" color="tertiary" style={styles.disclaimer}>
          {t('support.hub.disclaimer')}
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
  campaign: {
    gap: 8,
  },
  options: {
    overflow: 'hidden',
  },
  transparencyLink: {
    marginTop: 4,
  },
  disclaimer: {
    lineHeight: 18,
    marginTop: 8,
  },
});

import { useCallback, useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeContext';

import { MartyrCard } from '../components/MartyrCard';
import { getMartyrs } from '../engine/muharramRepository';
import type { MartyrProfile } from '../types';

export function MartyrsListScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const martyrs = useMemo(() => getMartyrs(), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('muharramModule.hub.martyrs'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
    });
  }, [navigation, t, theme]);

  const openProfile = useCallback(
    (martyrId: string) => {
      navigation.navigate('MartyrProfile', { martyrId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: MartyrProfile }) => (
      <View style={styles.cell}>
        <MartyrCard martyr={item} onPress={() => openProfile(item.id)} />
      </View>
    ),
    [openProfile],
  );

  return (
    <Screen padded={false}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing[5] }]}>
        <Text variant="bodySm" color="secondary">
          {t('muharramModule.martyrs.subtitle')}
        </Text>
      </View>
      <FlatList
        data={martyrs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingHorizontal: theme.spacing[5] }]}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 40,
    gap: 12,
  },
  cell: {
    marginBottom: 0,
  },
});

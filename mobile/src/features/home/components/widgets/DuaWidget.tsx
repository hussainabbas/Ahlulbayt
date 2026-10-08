import { Pressable, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';



import { Text } from '@/components/ui/Text';

import { useLocale } from '@/i18n/useLocale';

import { useTheme } from '@/theme/ThemeContext';

import type { RootStackParamList } from '@/navigation/types';



import { DashboardWidget } from '../DashboardWidget';

import type { DailyDua } from '../../types';



interface DuaWidgetProps {

  dua: DailyDua;

}



export function DuaWidget({ dua }: DuaWidgetProps) {

  const { t } = useLocale();

  const { theme } = useTheme();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  const openReader = () => {

    if (dua.duaId) {

      navigation.navigate('DailyLifeDuaReader', { duaId: dua.duaId });

      return;

    }

    navigation.navigate('DailyLifeDuas');

  };



  return (

    <Pressable onPress={openReader} accessibilityRole="button">

      <DashboardWidget label={t('home.dua')} accentColor={theme.colors.accentPrimary}>

        <Text variant="headingSm">{dua.title}</Text>

        {dua.arabic ? (

          <Text

            variant="bodyMd"

            style={[styles.arabic, { color: theme.colors.textPrimary, textAlign: 'right' }]}

          >

            {dua.arabic}

          </Text>

        ) : null}

        {dua.translation ? (

          <Text variant="bodySm" color="secondary">

            {dua.translation}

          </Text>

        ) : null}

        <View style={[styles.benefit, { backgroundColor: theme.colors.accentPrimaryMuted }]}>

          <Text variant="caption" color="accent">

            {dua.benefit}

          </Text>

        </View>

      </DashboardWidget>

    </Pressable>

  );

}



const styles = StyleSheet.create({

  arabic: {

    lineHeight: 30,

    writingDirection: 'rtl',

  },

  benefit: {

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 8,

    alignSelf: 'flex-start',

  },

});


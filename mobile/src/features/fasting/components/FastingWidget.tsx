import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

import { FastingWidgetCard } from './FastingWidgetCard';

export function FastingWidget() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return <FastingWidgetCard onPress={() => navigation.navigate('Fasting')} />;
}

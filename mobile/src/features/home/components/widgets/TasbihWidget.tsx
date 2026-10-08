import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

import { TasbihWidgetCard } from '@/features/tasbih/components/TasbihWidgetCard';

export function TasbihWidget() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TasbihWidgetCard
      onPress={() => navigation.navigate('Tasbih')}
      onContinue={() => navigation.navigate('TasbihCounter')}
    />
  );
}

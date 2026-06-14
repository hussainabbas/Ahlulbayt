import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Navigate to a root-stack screen from a nested tab or auth screen. */
export function useRootNavigation() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return {
    navigate: (
      screen: keyof RootStackParamList,
      params?: RootStackParamList[keyof RootStackParamList],
    ) => {
      if (params !== undefined) {
        // Bubble to root stack from nested tab navigators.
        (navigation as NavigationProp<RootStackParamList>).navigate(screen, params);
        return;
      }
      (navigation as NavigationProp<RootStackParamList>).navigate(screen);
    },
    reset: (screen: keyof RootStackParamList) => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: screen }],
        }),
      );
    },
  };
}

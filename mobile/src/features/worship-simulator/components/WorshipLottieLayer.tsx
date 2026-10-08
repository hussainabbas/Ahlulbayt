import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import type { SimAssetKey, SimAssetTheme } from '../illustrations/catalog';
import { getBundledLottie } from '../engine/assetRegistry';

interface WorshipLottieLayerProps {
  assetKey: SimAssetKey;
  theme: SimAssetTheme;
}

/** Subtle Lottie overlay — generated custom assets, not internet GIFs. */
export function WorshipLottieLayer({ assetKey, theme }: WorshipLottieLayerProps) {
  const source = getBundledLottie(assetKey, theme);
  if (!source) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <LottieView source={source} autoPlay loop style={styles.lottie} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});

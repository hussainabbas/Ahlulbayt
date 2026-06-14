const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const {NATIVE_AUDIO_ENABLED} = require('./nativeAudio.config.js');

const trackPlayerMock = path.resolve(__dirname, 'src/mocks/react-native-track-player.ts');
const lottieEntry = path.resolve(
  __dirname,
  'node_modules/lottie-react-native/lib/commonjs/index.js',
);

const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      if (!NATIVE_AUDIO_ENABLED && moduleName === 'react-native-track-player') {
        return {
          filePath: trackPlayerMock,
          type: 'sourceFile',
        };
      }
      // npm package "react-native" field points at unpublished src/index.tsx
      if (moduleName === 'lottie-react-native') {
        return {
          filePath: lottieEntry,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

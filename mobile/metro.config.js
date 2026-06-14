const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const {NATIVE_AUDIO_ENABLED} = require('./nativeAudio.config.js');

const trackPlayerMock = path.resolve(__dirname, 'src/mocks/react-native-track-player.ts');

const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      if (!NATIVE_AUDIO_ENABLED && moduleName === 'react-native-track-player') {
        return {
          filePath: trackPlayerMock,
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

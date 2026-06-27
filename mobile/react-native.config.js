const {NATIVE_AUDIO_ENABLED} = require('./nativeAudio.config.js');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: NATIVE_AUDIO_ENABLED
    ? {}
    : {
        'react-native-track-player': {
          platforms: {
            android: null,
            ios: null,
          },
        },
      },
};

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

module.exports = {
  resolver: {
    extraNodeModules: {
      stream: require.resolve('readable-stream'),
      crypto: require.resolve('react-native-crypto-js'),
      zlib: require.resolve('react-zlib-js'),
    },
    sourceExts: [...defaultSourceExts, 'cjs'],
  },
  assets: ['./assets/fonts/'],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

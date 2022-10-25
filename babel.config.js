module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      { unstable_transformProfile: 'hermes-stable' },
    ],
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-react-jsx',
  ],
};

module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@features': './src/features',
          '@services': './src/services',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@components': './src/components',
          '@store': './src/store',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@themes': './src/themes',
          '@config' : './src/config'
        },
      },
    ],
  ],
};

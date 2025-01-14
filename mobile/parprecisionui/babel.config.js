module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './app',
            '@app': './app',
            '@components': './app/components',
            '@screens': './app/screens',
            '@constants': './app/constants',
            '@services': './app/services',
            '@utils': './app/utils',
            '@assets': './assets',
            '@types': './app/types',
            '@shared': './shared'
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json'
          ]
        }
      ],
      'react-native-reanimated/plugin',
      process.env.NODE_ENV === 'production' && 'transform-remove-console'
    ].filter(Boolean)
  };
};

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add custom resolver for platform-specific files
config.resolver.sourceExts = process.env.RN_SRC_EXT
  ? [...process.env.RN_SRC_EXT.split(',').filter(Boolean), ...config.resolver.sourceExts]
  : [...config.resolver.sourceExts];

// Handle platform-specific files
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for module aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'app'),
  '@app': path.resolve(__dirname, 'app'),
  '@components': path.resolve(__dirname, 'app/components'),
  '@screens': path.resolve(__dirname, 'app/screens'),
  '@constants': path.resolve(__dirname, 'app/constants'),
  '@services': path.resolve(__dirname, 'app/services'),
  '@utils': path.resolve(__dirname, 'app/utils'),
  '@assets': path.resolve(__dirname, 'assets'),
  '@types': path.resolve(__dirname, 'app/types'),
  '@shared': path.resolve(__dirname, 'shared')
};

// Add support for monorepo structure if needed
config.watchFolders = [path.resolve(__dirname, '..')];

// Optimize asset loading
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;

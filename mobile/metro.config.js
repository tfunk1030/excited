const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');

const config = getSentryExpoConfig(__dirname);

// Get the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Merge configurations
module.exports = {
  ...config,
  ...defaultConfig,
  resolver: {
    ...config.resolver,
    ...defaultConfig.resolver,
    extraNodeModules: {
      ...config.resolver?.extraNodeModules,
      ...defaultConfig.resolver?.extraNodeModules,
      'expo-router': path.resolve(__dirname, 'node_modules/expo-router')
    }
  }
};

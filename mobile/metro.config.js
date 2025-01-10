const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  server: {port: 8081},
  watchFolders: [],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

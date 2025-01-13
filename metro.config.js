const {getDefaultConfig} = require('expo/metro-config');

const config = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp']
  }
};

module.exports = getDefaultConfig(__dirname); 
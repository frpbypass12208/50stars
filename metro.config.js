const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'expo-auth-session': path.resolve(__dirname, 'modules/expo-auth-session.ts'),
  'expo-web-browser': path.resolve(__dirname, 'modules/expo-web-browser.ts'),
};

module.exports = config;

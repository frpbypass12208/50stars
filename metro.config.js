const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const stubModules = {
  'expo-auth-session': path.resolve(__dirname, 'modules/expo-auth-session.ts'),
  'expo-web-browser': path.resolve(__dirname, 'modules/expo-web-browser.ts'),
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (stubModules[moduleName]) {
    return {
      filePath: stubModules[moduleName],
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

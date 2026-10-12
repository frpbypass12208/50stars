const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports for expo-router SSR compatibility
config.resolver.unstable_enablePackageExports = true;
// Do NOT include 'react-native' condition — it causes Platform to resolve
// incorrectly in the SSR bundle, producing invalid syntax in ExpoRoot.js
config.resolver.unstable_conditionNames = ['require', 'default'];

module.exports = config;

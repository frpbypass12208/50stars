module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Disable auto-inclusion of reanimated plugin to avoid
          // @babel/traverse version conflict (FunctionParent in undefined)
          reanimated: false,
        },
      ],
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};

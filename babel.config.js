module.exports = function (api) {
  api.cache(false)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'expo-web-browser': './modules/expo-web-browser',
          },
        },
      ],
    ],
  }
}

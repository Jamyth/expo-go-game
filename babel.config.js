const path = require('path');

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
          "babel-plugin-module-resolver",
          {
              extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
              alias: {
                  "expo-go": path.join(__dirname, "./src"),
              },
          },
      ],
      // ["babel-plugin-macros"],
  ],
  };
};

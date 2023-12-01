module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          safe: true, // only allow environment variables defined in .env
        },
      ],
    ],
  };
};

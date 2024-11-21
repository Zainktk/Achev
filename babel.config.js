module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",

      {
        root: ["."],
        alias: {
          "@components": "./src/components",
          "@atoms": "./src/components/atoms",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@navigation": "./src/navigation",
          "@types": "./src/types",
          "@hooks": "./src/hooks",
          "@graphql": "./src/graphql",
        },
      },
    ],
  ],
};

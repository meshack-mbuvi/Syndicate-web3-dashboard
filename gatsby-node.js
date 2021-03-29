const path = require("path");
const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions, loaders, stage }) => {
  console.log({ stage });
  // if (stage === "build-html") {
  //   console.log("in if");
  //   actions.setWebpackConfig({
  //     module: {
  //       rules: [
  //         {
  //           test: /web3-providers-ws/,
  //           use: loaders.null(),
  //         },
  //       ],
  //     },
  //   });
  // }
  actions.setWebpackConfig({
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        util: require.resolve("util/"),
        assert: require.resolve("assert/"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
        // btoa: "btoa/",
      }),
    ],
  });
};

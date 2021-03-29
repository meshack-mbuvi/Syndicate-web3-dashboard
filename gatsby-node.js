const path = require("path");
const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions, loaders, stage }) => {
  /**
   * During server side rendering, we should use the node process module,
   * otherwise we use the browser process implementation.
   */
  if (stage !== "build-html") {
    actions.setWebpackConfig({
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
          btoa: "btoa/",
        }),
      ],
    });
  }
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
      }),
    ],
  });
};

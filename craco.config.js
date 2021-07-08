/*const {
  when,
  whenDev,
  whenProd,
  whenTest,
  ESLINT_MODES,
  POSTCSS_MODES,
} = require("@craco/craco");*/

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  webpack: {
    plugins: [
      //   new ConfigWebpackPlugin(),

      new CopyPlugin({
        patterns: [
          {
            from: "public/manifest.json",
            transform(content, path) {
              return content
                .toString()
                .replace(
                  /%\w+%/g,
                  (m) => process.env[m.slice(1, m.length - 1)] || ""
                );
            },
          },
        ],
      }),
    ],
  },
};

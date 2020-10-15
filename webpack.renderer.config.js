const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules: [
      // Add support for native node modules
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          publicPath: "..", // move up from 'main_window'
          context: "src", // set relative working folder to src
        },
      },
      {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }],
      },
      {
        test: /\.styl$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'stylus-loader' },
        ]
      },
      // {
      //   test: /\.(m?js|node)$/,
      //   parser: { amd: false },
      //   use: {
      //     loader: '@marshallofsound/webpack-asset-relocator-loader',
      //     options: {
      //       outputAssetBase: 'native_modules',
      //     },
      //   },
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|.webpack)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                '@babel/preset-react',
                ['@babel/preset-env', {
                  targets: {
                    "ie": "10",
                    edge: "17",
                    firefox: "60",
                    chrome: "60",
                    safari: "12",
                  },
                  useBuiltIns: "usage",
                  corejs: 3
                }]
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
              ],
              cacheDirectory: true
            },
          }
        ],
      },
      // Put your webpack loader rules in this array.  This is where you would put
      // your ts-loader configuration for instance:
      /**
       * Typescript Example:
       *
       * {
       *   test: /\.tsx?$/,
       *   exclude: /(node_modules|.webpack)/,
       *   loaders: [{
       *     loader: 'ts-loader',
       *     options: {
       *       transpileOnly: true
       *     }
       *   }]
       * }
       */
    ],
  },
  // plugins: [
  //   new CopyWebpackPlugin( {
  //     patterns: [
  //       { from: path.join("node_modules", "glyphicons-only-bootstrap/fonts"), to: path.join("main_window", "fonts") }
  //       ]
  //   }),
  // ]
};

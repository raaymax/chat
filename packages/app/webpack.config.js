const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const pack = require('./package.json');
const config = require('../../chat.config');

module.exports = {
  entry: {
    app: './src/index.js',
    secured: './src/js/pages/secured.js',
    sw: './src/sw.js',
    'firebase-messaging-sw': './src/fcm-sw.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pack.version),
      APP_NAME: JSON.stringify(pack.name),
      SERVER_URL: JSON.stringify(config.serverUrl),
      IMAGES_URL: JSON.stringify(config.imagesUrl),
      FIREBASE_CONFIG: JSON.stringify(config.firebase),
      SENTRY_DNS: JSON.stringify(config.sentryDns),
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/manifest.json', to: '.' },
        { from: './src/index.html', to: '.' },
      ],
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  mode: 'development',
  devtool: 'eval',
};

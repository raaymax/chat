const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');
const webpack = require('webpack');
const pack = require('../../package.json');
const config = require('../../config');

module.exports = {
  entry: {
    app: './src/index.js',
    'firebase-messaging-sw': './src/fcm-sw.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pack.version),
      APP_NAME: JSON.stringify(pack.name),
      IMAGES_URL: JSON.stringify(config.imagesUrl),
      FIREBASE_CONFIG: JSON.stringify(config.firebase),
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/manifest.json', to: '.' },
        { from: './src/index.html', to: '.' },
      ],
    }),
    new InjectManifest({
      exclude: [],
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
      swSrc: './src/sw.js',
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
  devtool: 'eval-source-map',
};

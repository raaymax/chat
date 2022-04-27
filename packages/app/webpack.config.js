const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const pack = require('./package.json');

module.exports = {
  entry: {
    app: './src/index.js',
    sw: './src/sw.js',
    'firebase-messaging-sw': './src/fcm-sw.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(pack.version),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL || 'wss://chat.codecat.io/ws'),
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/manifest.json', to: '.' },
        { from: './src/index.html', to: '.' },
      ],
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
    ],
  },
  mode: 'development',
};

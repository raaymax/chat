const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const package = require('./package.json');


module.exports = {
  entry: {
    index: './src/index.js',
    sw: './src/sw.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_VERSION: package.version,
      SERVER_URL: (process.env.SERVER_URL || 'wss://chat.codecat.io/ws'),
      ENVIRONMENT: process.env.NODE_ENV || 'development',
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
      excludeChunks: ['sw'],
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets', to: 'assets' },
        { from: './src/manifest.json', to: '.' },
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

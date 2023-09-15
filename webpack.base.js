//@ts-check

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.join(__dirname, './src/view/index.tsx'), // 入口文件
  output: {
    filename: 'static/js/[name].js',
    path: path.join(__dirname, './out/dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        exclude: [ 
          /node_modules/,
          path.resolve(__dirname, './src/bard/')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.less$/,
                localIdentName: '[name]__[local]-[hash:base64:5]',
              },
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          }, 
          "postcss-loader"
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/view/index.html'),
      inject: true, // 自动注入静态资源
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
      ignoreOrder: true,
    }),
  ],
};

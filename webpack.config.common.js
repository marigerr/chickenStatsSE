const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: { app: './app.js' },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  resolve: {
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Data: path.resolve(__dirname, 'src/data/'),
      Stylesheets: path.resolve(__dirname, 'src/stylesheets/'),
      // Modules: [path.resolve(__dirname, "./src"), "node_modules"]},
    }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
    new HtmlWebpackPlugin({ template: __dirname + '/src/index.html' })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        //   exclude: [/node_modules/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          }
          , 'css-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          }
        }]
      },
      {
        test: /\.js$/,
        enforce: "pre", // preload the eshint loader before transpile
        exclude: [/node_modules/],
        use: [{
          loader: "eslint-loader",
          // options: { emitErrors: false, failOnHint: false, esversion: 6 }
          // options: { fix: true }
        }]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }],
      },
    ]
  }
};
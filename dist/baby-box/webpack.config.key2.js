'use strict';

var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

var __app_name = 'key2';

module.exports = {
  name: __app_name,
  mode: 'development',
  entry: {
    main: ['./src/' + __app_name + '/index.js', './webpack-hot-middleware/client?path=/ws/' + __app_name + '/__webpack_hmr']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },

  plugins: [new CleanWebpackPlugin(['dist/' + __app_name]), new HtmlWebpackPlugin({
    template: 'index.html',
    inject: true,
    stats: {
      children: false
    }
  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
  output: {
    filename: 'app.' + __app_name + '.js',
    path: path.resolve(__dirname, '../dist/' + __app_name),
    publicPath: '/' + __app_name + '/'
  }
};
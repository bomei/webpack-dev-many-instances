'use strict';

var webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './client.js'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: '#source-map',
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]
};
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  entry: {
    main:['./src/key1/index.js','webpack-hot-middleware/client?path=/key1/_whaaat']
    // index:['./index.html','webpack-hot-middleware/client']
  },
  devtool: 'inline-source-map',
  devServer:{
    contentBase: './dist',
    hot: true
  },

  plugins: [
    new CleanWebpackPlugin(['dist/key1']),
    new HtmlWebpackPlugin({
      // title: 'Bo webpack',
      template: 'index.html',
      inject: true,
    }),
    
    // OccurenceOrderPlugin is needed for webpack 1.x only
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist','key1'),
    publicPath: 'http://localhost:3000/key1',
    // hotUpdateChunkFilename: 'hot-update.js',
    // hotUpdateMainFilename: 'hot-update.json',
  }
};
const path=require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

var __app_name = 'hello'

module.exports = {
    name: __app_name,
    mode: 'development',
    entry: {
      main:[`./src/${__app_name}/index.js`,`./webpack-hot-middleware/client?path=/ws/${__app_name}/__webpack_hmr`]
      // index:['./index.html','webpack-hot-middleware/client']
    },
    devtool: 'inline-source-map',
    devServer:{
      contentBase: './dist',
      hot: true
    },
  
    plugins: [
      new CleanWebpackPlugin([`./dist/${__app_name}`]),
      new HtmlWebpackPlugin({
        // title: 'Bo webpack',
        template: 'index.html',
        inject: true,
        stats:{
          children: false
        }
      }),
      
      // OccurenceOrderPlugin is needed for webpack 1.x only
      // new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      // Use NoErrorsPlugin for webpack 1.x
      new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, `../../dist/${__app_name}`),
      publicPath: `/${__app_name}/`,
      // hotUpdateChunkFilename: '[hash].hot-update.js',
      // hotUpdateMainFilename: '[hash].hot-update.json',
    }
  };
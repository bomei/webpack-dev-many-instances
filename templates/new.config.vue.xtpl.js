const path=require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

var __app_name = {{{appName}}}

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
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development'
        }
      }),
      new CleanWebpackPlugin([`./dist/${__app_name}`]),
      new HtmlWebpackPlugin({
        // title: 'Bo webpack',
        template: 'index.html',
        inject: true,
        stats:{
          children: false
        }
      }),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      // OccurenceOrderPlugin is needed for webpack 1.x only
      // new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      // Use NoErrorsPlugin for webpack 1.x
      new webpack.NoEmitOnErrorsPlugin(),
      // new CopyWebpackPlugin([
      //   {
      //     from: path.resolve(__dirname, '../src'),
      //     to: config.dev.assetsSubDirectory,
      //     ignore: ['.*']
      //   }
      // ])
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, `../../dist/${__app_name}`),
      publicPath: `/${__app_name}/`,
      // hotUpdateChunkFilename: '[hash].hot-update.js',
      // hotUpdateMainFilename: '[hash].hot-update.json',
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },
  };
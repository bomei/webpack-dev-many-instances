const path=require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoader = require('vue-loader')
const VueLoaderConf = require('./vue-loader.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')

var __app_name = 'vue2'

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    name: __app_name,
    mode: 'development',
    entry: {
        main:[`./src/${__app_name}/main.js`,`./webpack-hot-middleware/client?path=/ws/${__app_name}/__webpack_hmr`]
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
                NODE_ENV: '"development"'
            }
        }),
        // new CleanWebpackPlugin([path.join(__dirname,`../dist/${__app_name}`)]),
        new HtmlWebpackPlugin({
        // title: 'Bo webpack',
            template: './src/vue2/index.pug',
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
        new VueLoader.VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, `../src/${__app_name}/yaml`),
                to: path.resolve(__dirname, `../../dist/${__app_name}`),
                ignore: ['.*']
            }
        ]),
        new webpack.ProvidePlugin({
            Vue: 'vue',
        })
    ],
    output: {
        filename: `${__app_name}.bundle.js`,
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
                options:  VueLoaderConf,
                exclude:/node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:[
                    'vue-style-loader',
                    {loader: 'css-loader', options:{sourceMap: true}},
                    {loader:'postcss-loader',options:{sourceMap:true}}
                ],
                exclude:/node_modules/
            },
            {
                test:/\.postcss$/,
                use:[
                    'vue-style-loader',
                    {loader: 'css-loader', options:{sourceMap: true}},
                    {loader:'postcss-loader',options:{sourceMap:true}}
                ],
                exclude:/node_modules/
            },
            {
                test:/\.js$/,
                loader: 'babel-loader',
                exclude:/node_modules/
            },
            {
                test:/\.pug$/,
                loader: 'pug-loader',
                exclude:/node_modules/
            },
            {
                test:/\.yaml$/,
                loader: 'yaml-loader',
                exclude:/node_modules/
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
            '@': resolve(`src/${__app_name}`),
        }
    },
}
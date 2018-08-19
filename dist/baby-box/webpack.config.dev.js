'use strict';

var _require = require('vue-loader'),
    VueLoaderPlugin = _require.VueLoaderPlugin;

var path = require('path');
var VueLoaderConf = require('./vue-loader.conf');
function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    mode: 'development',
    entry: ['./src/vue1/app.js'],
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: VueLoaderConf
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader'
        }, {
            test: /\.css$/,
            use: 'css-loader'
        }]
    },
    plugins: [new VueLoaderPlugin()],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src/vue1')
        }
    }
};
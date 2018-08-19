'use strict';

var webpack = require('webpack');
var webpackDevMiddleware = require('../index');

var config = require('../configs/webpack.config.vue2');

var compiler = webpack(config);

var wdm = webpackDevMiddleware(compiler, {
    hot: true,
    stats: {
        colors: true
    }
});
var nonuse = void 0;
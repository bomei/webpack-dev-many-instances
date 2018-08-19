'use strict';

var utils = require('../utils/utils');
var loaders = void 0;
loaders = utils.cssLoaders({
    sourceMap: true,
    extract: false
});

loaders = {
    css: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true } }],
    postcss: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true } }],
    styl: ['vue-style-loader', { loader: 'css-loader', options: { sourceMap: true } }, { loader: 'stylus-loader', options: { sourceMap: true } }]
};
module.exports = {
    loaders: loaders,
    cssSourceMap: true,
    cacheBusting: true,
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
};
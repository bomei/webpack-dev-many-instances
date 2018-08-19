'use strict'
const utils = require('../utils/utils')
let loaders
loaders = utils.cssLoaders({
    sourceMap: true,
    extract: false
})
// console.log(loaders)
loaders= {
    css: ['vue-style-loader',{loader: 'css-loader', options:{sourceMap: true}}],
    postcss: ['vue-style-loader',{loader: 'css-loader', options:{sourceMap: true}}],
    styl: ['vue-style-loader',{loader:'css-loader',options:{sourceMap:true}}, {loader:'stylus-loader',options:{sourceMap:true}}]
}
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
}

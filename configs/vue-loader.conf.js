'use strict'
// const utils = require('../utils/utils')
// const isProduction = false
// const sourceMapEnabled = true
let loaders
// let loaders = utils.cssLoaders({
//     sourceMap: true,
//     extract: false
// })
// console.log(loaders)
loaders= {
    css: ['vue-style-loader',{loader: 'css-loader', options:{sourceMap: true}}]
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

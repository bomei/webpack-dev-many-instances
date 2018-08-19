const webpack = require('webpack')
const webpackDevMiddleware = require('../index')

const config = require('../configs/webpack.config.vue2')

const compiler = webpack(config)

let wdm=webpackDevMiddleware(compiler,{
    hot:true,
    stats:{
        colors:true,
    }
})
let nonuse
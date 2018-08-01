const webpack = require('webpack')
const webpackDevMiddleware = require('../webpack-dev-middleware')

const config = require('../configs/webpack.config.vue2')

const compiler = webpack(config)

webpackDevMiddleware(compiler,{
    hot:true,
    stats:{
        colors:true,
    }
}).then((res)=>{})
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('./webpack-dev-middleware')
const bodyParser = require('body-parser')
var multer = require('multer') // v1.0.5
var upload = multer() // for parsing multipart/form-data

const app = express()
// const config = require('./webpack.config.js')
// const compiler = webpack(config)



// app.use(webpackDevMiddleware(compiler, {
//     hot: true,
//     stats:{
//         colors: true,
//         children: true,
//     },
//     // lazy: true
//     // publicPath: config.output.publicPath
// }))

// app.use(require('./webpack-hot-middleware')(compiler,{
//     log: console.log,
//     path:'/_whaaat',
//     // hotUpdateChunkFilename: '[hash].hot-update.js',
//     // hotUpdateMainFilename:'[hash].hot-update.json'
// }))


// app.use(require('webpack-hot-server-middleware')(compiler),{
//   path:"/_whaaat"
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//     next()
// })



app.post('/new', upload.array(), (req, res, next)=>{
    console.log(req)
    res.send('express get this response')
})



// Serve the files on port 3000.
app.listen(5000, function () {
    console.log('Example app listening on port 5000!\n')
})
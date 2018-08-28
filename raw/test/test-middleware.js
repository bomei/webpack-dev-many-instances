// import WebpackDevMiddleware from '../index'
import express from 'express'
import WebpackDevMiddleware from '../wp-dev-middleware-dynamic-config/index'
import bodyParser from 'body-parser'
import CompilerManager from '../utils/compilerManager'
import WebpackHotMiddleware from '../webpack-hot-middleware-dynamic-config/new-mhw'


// console.log(config)
const app = express()

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded())

let cm = new CompilerManager()

const wdm = new WebpackDevMiddleware(cm)
app.use(wdm.middleware.bind(wdm))

const whm = new WebpackHotMiddleware(cm)
app.use(whm.middleware.bind(whm))


function extractName(path){
    let regex = /\/(.*)(\/).*/
}

app.use((req,res,next)=>{
    return next()
})
// app.use(webpackHotMiddleware)
function addRoutes(){
    app.get('/get',(req,res)=>{
        res.send('get')
    })

    app.get('/new',(req,res)=>{
        let appName = req.param('app-name')
        let config = require(`../configs/webpack.config.${appName}.js`)
        config = config.config || config
        cm.addConfig(config,true)
        wdm.addConfig(config.name,{
            hot:true,
            stats:{
                colors: true,
                children: false,
                name: true
            }
        })
        whm.addConfig(config.name,{
            log: console.log,
            path:'/_whaaat'
        })
    })

    app.get('/cover',(req,res)=>{
        let appName = req.param('app-name')
        let {config} = require(`../configs/webpack.config.${appName}.js`)
        cm.addConfig(config, false)
        let result = wdm.addConfig(config.name)
        res.send(result)
    })

    app.get('/delete/:name',(req,res)=>{
        let name = req.params.name
        res.send('delete')
    })

    app.get('/test',(req, res)=>{
        // new a default config and start watching as its default action
        console.log('new a default config named key1')
        let result = wdm.addConfig(config)
        console.log('new config', result)
        console.log('stop watching')
        result = wdm.closeWatch('key1')
        console.log('stop watch',result)
        console.log('delete config')
        result=wdm.deleteConfig('key1')
        console.log('delete config key1',result)
        res.send('test')
    })

    // app.get('*',(req,res)=>{
    //     res.send('hello')
    // })

    app.post('*',(req,res)=>{
        console.log(req.query,req.body,req.params)
        res.send('post')
    })

    app.delete('/:name',(req,res)=>{
        console.log(req.query,req.body,req.params)
        res.send('delete')
    })
}

addRoutes()

app.listen(5555,()=>{
    console.log('Server is listening :5555')
})


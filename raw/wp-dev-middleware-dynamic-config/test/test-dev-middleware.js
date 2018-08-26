// import WebpackDevMiddleware from '../index'
import express from 'express'
import {config} from '../../configs/webpack.config.key1'
import WebpackDevMiddleware from '../index'
import webpackHotMiddleware from 'webpack-hot-middleware'
import bodyParser from 'body-parser'


// console.log(config)
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())


const wdm = new WebpackDevMiddleware()
app.use(wdm.middleware.bind(wdm))

// app.use(webpackHotMiddleware)
function addRoutes(){
    app.get('/get',(req,res)=>{
        res.send('get')
    })

    app.get('/new',(req,res)=>{
        let result = wdm.addConfig(config)
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

    app.get('*',(req,res)=>{
        res.send('hello')
    })

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


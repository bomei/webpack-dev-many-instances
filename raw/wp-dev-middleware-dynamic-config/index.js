'use strict'

const mime = require('mime')
const createContext = require('./lib/context')
import Middleware from './lib/middleware'
const reporter = require('./lib/reporter')
const { setFs, toDisk } = require('./lib/fs')
const { getFilenameFromUrl, noop, ready } = require('./lib/util')
import {ConfigStore} from '../utils/ConfigStore'

require('loud-rejection/register')

const defaults = {
    logLevel: 'info',
    logTime: false,
    logger: null,
    mimeTypes: null,
    reporter,
    stats: {
        colors: true,
        context: process.cwd()
    },
    watchOptions: {
        aggregateTimeout: 200
    },
    writeToDisk: false
}

export default class WebpackDevMiddleware{
    constructor(configStore){
        this.configStore= configStore || new ConfigStore()
        this.wdm = new Middleware(this.configStore)
    }

    addConfig(config, opts){
        return this.configStore.addConfig(config,opts)
    }

    closeWatch(name, callback){
        try{
            this.configStore.closeWatch(name,callback)
            return true
        }catch(e){
            return e
        }
    }


    deleteConfig(name, opts){
        let result=this.closeWatch(name)
        if(result){
            this.configStore.removeConfig(name)
        }
    }

    middleware(req, res, next){
        return this.wdm.middleware(req,res,next)
    }
}
'use strict'

const mime = require('mime')
const createContext = require('./lib/context')
import Middleware from './lib/middleware'
const reporter = require('./lib/reporter')
const { setFs, toDisk } = require('./lib/fs')
const { getFilenameFromUrl, noop, ready } = require('./lib/util')
import {CompilerManager} from '../utils/compilerManager'

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
    constructor(compilerManeger){
        this.compilerManeger= compilerManeger
        this.wdm = new Middleware(this.compilerManeger, this.contextManager)
        this.contextManager = new Map()
        this.optionsMap = new Map()
    }

    addConfig(name, opts){
        const options = Object.assign({},defaults,opts)
        if (options.lazy) {
            if (typeof options.filename === 'string') {
                const filename = options.filename
                    .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
                    .replace(/\\\[[a-z]+\\\]/ig, '.+');
    
                options.filename = new RegExp(`^[/]{0,1}${filename}$`);
            }
        }

        // defining custom MIME type
        if (options.mimeTypes) {
            mime.define(options.mimeTypes);
        }

        this.optionsMap.set(name, options)

        this.handleNewConfig(name)
        
        
    }

    handleNewConfig(name){
        let {compiler} = this.compilerManeger.get(name)
        let options = this.optionsMap.get(name)
        const context = createContext(compiler,options)

        // start watching
        if (!options.lazy) {
            const watching = compiler.watch(options.watchOptions, (err) => {
                if (err) {
                    context.log.error(err.stack || err);
                    if (err.details) {
                        context.log.error(err.details);
                    }
                }
            });

            context.watching = watching;
        } else {
            context.state = true;
        }
        if (options.writeToDisk) {
            toDisk(context);
        }
    
        setFs(context, compiler)
        
        this.contextManager.set(name,context)

    }


    deleteConfig(name){
        let context = this.contextManager.get(name)
        let result=context.watching.close()
        this.compilerManeger.deleteConfig(name)
    }

    middleware(req, res, next){
        return this.wdm.middleware(req,res,next)
    }
}
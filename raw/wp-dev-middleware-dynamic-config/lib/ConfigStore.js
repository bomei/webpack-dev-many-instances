'use strict'

const mime = require('mime')
const webpack = require('webpack')
const createContext = require('./context')
const reporter = require('./reporter')
const { setFs, toDisk } = require('./fs')


function configComplilerContext(config, opts){

    const options = Object.assign({}, defaults, opts)
    let compiler = webpack(config)

    if (options.lazy) {
        if (typeof options.filename === 'string') {
            const filename = options.filename
                .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
                .replace(/\\\[[a-z]+\\\]/ig, '.+')

            options.filename = new RegExp(`^[/]{0,1}${filename}$`)
        }
    }

    // defining custom MIME type
    if (options.mimeTypes) {
        mime.define(options.mimeTypes)
    }

    const context = createContext(compiler, options)

    // start watching
    if (!options.lazy) {
        const watching = compiler.watch(options.watchOptions, (err) => {
            if (err) {
                context.log.error(err.stack || err)
                if (err.details) {
                    context.log.error(err.details)
                }
            }
        })
  
        context.watching = watching
    } else {
        context.state = true
    }
  
      
    if (options.writeToDisk) {
        toDisk(context)
    }

    setFs(context, compiler)

    

    return {
        config,
        compiler,
        context,
    }
}

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


export class ConfigStore{
    constructor(){
        this.configShelt=new Map()
    }

    addConfig(config, opts){
        this.configShelf.set('hello',config)
    }
}

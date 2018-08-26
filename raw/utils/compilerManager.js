'use strict'

import mime from 'mime'
import webpack from 'webpack'
import createContext from './context'
import reporter from './reporter'
import { setFs, toDisk } from './fs'
import {default as weblog} from 'webpack-log'
import MemoryFileSystem from 'memory-fs'
import DevMiddlewareError from './DevMiddlewareError'
import pathabs from 'path-is-absolute'
import {Middleware} from './middleware'
import { noop } from './util'


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

class Hook{
    constructor(middlewareNme, action, func){
        this.middlewareNme=middlewareNme
        this.action=action
        this.func=func
    }
}

export class CompilerManager{
    constructor(){
        this.configShelf=new Map()
        this.compilerShelf = new Map()
        this.hooks = {
            add: new Array(),
            delete: new Array()
        }
    }

    register(middlewareNme, action, func){
        if(action != 'add' && action!='delete') return `${action} not supported`
        this.hooks[action].push(new Hook(middlewareNme, action,func))
    }

    addConfig(config){
        if(!config.name) return 'Config.name is required!'
        if(this.compilerShelf.has(config.name)) return `${config.name} has existed!`
        let compiler = webpack(config)
        this.compilerShelf.set(config.name,{config,compiler})
        // this.hooks.add.forEach((hook)=>{
        //     hook.func(config.name)
        // })
    }

    deleteConfig(name){
        if(!this.compilerShelf.has(name)) return `${name} not exists`
        // this.hooks.delete.forEach((hook)=>{
        //     hook.func(name)
        // })
        this.compilerShelf.delete(name)
    }
}

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


export class ConfigStore{
    constructor(){
        this.configShelf=new Map()
    }

    addConfig(config, opts){
        if(this.configShelf.has(config.name)) return `${config.name} already exists`
        try{
            let {options, compiler, context} = this.handleNewConfig(config, opts)
            this.configShelf.set(config.name,{config,options,compiler,context})
            return true
        } catch(e){
            return e
        }
    }

    handleNewConfig(config, opts){
        const compiler = webpack(config)
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

        const context = this._createContext(compiler,options)

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
    
        this._setFs(context, compiler)
        
        return {options, compiler, context}

    }

    _setFs(context, compiler){
        if (typeof compiler.outputPath === 'string' && !pathabs.posix(compiler.outputPath) && !pathabs.win32(compiler.outputPath)) {
            throw new DevMiddlewareError('`output.path` needs to be an absolute path or `/`.');
        }

        let fileSystem;
        // store our files in memory
        const isMemoryFs = !compiler && compiler.outputFileSystem instanceof MemoryFileSystem;

        if (isMemoryFs) {
            fileSystem = compiler.outputFileSystem;
        } else {
            fileSystem = new MemoryFileSystem();
            compiler.outputFileSystem = fileSystem;
        }

        context.fs = fileSystem;
    }

    _createContext(compiler,options){
        const context = {
            state: false,
            webpackStats: null,
            callbacks: [],
            options,
            compiler,
            watching: null,
            forceRebuild: false
        };

        if (options.logger) {
            context.log = options.logger;
        } else {
            context.log = weblog({
                level: options.logLevel || 'info',
                name: 'wdm',
                timestamp: options.logTime
            });
        }

        const {log}=context

        function done(stats){
            context.state = true
            context.webpackStats = stats

            process.nextTick(()=>{
                if (!context.state){
                    return;
                }
            })

            // print webpack output
            context.options.reporter(context.options, {
                log,
                state: true,
                stats
            });

            // execute callback that are delayed
            const cbs = context.callbacks;
            context.callbacks = [];
            cbs.forEach((cb) => {
                cb(stats);
            });
            // In lazy mode, we may issue another rebuild
            if (context.forceRebuild) {
                context.forceRebuild = false;
                rebuild();
            }
        }

        function invalid(callback){
            if (context.state) {
                context.options.reporter(context.options, {
                    log,
                    state: false
                });
            }
            
            // We are now in invalid state
            context.state = false;
            if (typeof callback === 'function') {
                callback();
            }

        }

        function rebuild() {
            if (context.state) {
                context.state = false;
                context.compiler.run((err) => {
                    if (err) {
                        log.error(err.stack || err);
                        if (err.details) {
                            log.error(err.details);
                        }
                    }
                });
            } else {
                context.forceRebuild = true;
            }
        }

        context.rebuild = rebuild;
        context.compiler.hooks.invalid.tap('WebpackDevMiddleware', invalid);
        context.compiler.hooks.run.tap('WebpackDevMiddleware', invalid);
        context.compiler.hooks.done.tap('WebpackDevMiddleware', done);
        context.compiler.hooks.watchRun.tap('WebpackDevMiddleware', (comp, callback) => {
            invalid(callback);
        });

        return context
    }

    closeWatch(name, callback){
        callback = callback || noop
        this.configShelf.get(name).context.watching.close(callback)
        this.configShelf.get(name).watching='closed'
    }

    startWatch(name){
        if(this.configShelf.get(name).watching!='closed') return 'Already in watch state.'
        let {options, compiler,context} = this.configShelf.get(name)
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
        this.configShelt[name].context = context
        return 'Restart watching'
    }

    removeConfig(name){
        this.closeWatch(name)
        this.configShelt.delete(name)
    }
}

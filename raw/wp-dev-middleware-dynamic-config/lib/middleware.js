'use strict'

const mime = require('mime')
const urlJoin = require('url-join')
const DevMiddlewareError = require('./DevMiddlewareError')
const { getFilenameFromUrl, handleRangeHeaders, handleRequest, ready, noop } = require('./util')

export default class Middleware{
    constructor(compilerManager, contextManeger){
        this.compilerManager = compilerManager
        this.contextManeger = contextManeger
    }

    middleware(req, res, next){
        let name = req.path.split('/')[1]
        if (!name || !this.contextManeger.has(name)) return next()
        req.appName = name
        res.locals = res.locals || {}
        const context = this.contextManeger.get(name)

        function goNext() {
            try{
                if (!context || !context.options.serverSideRender) {
                    return next();
                }

                return new Promise(((resolve) => {
                    ready(context, () => {
                        res.locals.webpackStats = context.webpackStats;
                        resolve(next());
                    }, req);
                }));
            }catch(e){
                console.log(e)
            }
        }

        if (req.method != 'GET'){
            return goNext()
        }

        let filename = getFilenameFromUrl(context.options.publicPath, context.compiler, req.url);

        if (filename === false) {
            return goNext();
        }

        if(process.platform === 'win32'){
            filename = filename.replace(/\\/g,'/')
        }

        return new Promise(((resolve) => {
            handleRequest(context, filename, processRequest, req);
            function processRequest() {
                try {
                    let stat = context.fs.statSync(filename);

                    if (!stat.isFile()) {
                        if (stat.isDirectory()) {
                            let { index } = context.options;

                            if (index === undefined || index === true) {
                                index = 'index.html';
                            } else if (!index) {
                                throw new DevMiddlewareError('next');
                            }

                            filename = urlJoin(filename, index);
                            stat = context.fs.statSync(filename);
                            if (!stat.isFile()) {
                                throw new DevMiddlewareError('next');
                            }
                        } else {
                            throw new DevMiddlewareError('next');
                        }
                    }
                } catch (e) {
                    return resolve(goNext());
                }

                // server content
                let content = context.fs.readFileSync(filename);
                content = handleRangeHeaders(content, req, res);

                let contentType = mime.getType(filename);

                // do not add charset to WebAssembly files, otherwise compileStreaming will fail in the client
                if (!/\.wasm$/.test(filename)) {
                    contentType += '; charset=UTF-8';
                }

                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Length', content.length);

                const { headers } = context.options;
                if (headers) {
                    for (const name in headers) {
                        if ({}.hasOwnProperty.call(headers, name)) {
                            res.setHeader(name, context.options.headers[name]);
                        }
                    }
                }
                // Express automatically sets the statusCode to 200, but not all servers do (Koa).
                res.statusCode = res.statusCode || 200;
                if (res.send) res.send(content);
                else res.end(content);
                resolve();
            }
        }));

    }

}
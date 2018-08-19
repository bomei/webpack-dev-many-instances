'use strict'

const mime = require('mime')
const urlJoin = require('url-join')
const DevMiddlewareError = require('./DevMiddlewareError')
const { getFilenameFromUrl, handleRangeHeaders, handleRequest, ready, noop } = require('./util')


module.exports = function wrapper(configStore) {
    function middleware(req, res, next) {
    // fixes #282. credit @cexoso. in certain edge situations res.locals is
    // undefined.

        if(!(req.name in configStore.configShelt)){
            next()
        }

        this.context = configStore[req.name].context


        

        res.locals = res.locals || {}

        function goNext() {
            if (!this.context.options.serverSideRender) {
                return next()
            }

            return new Promise(((resolve) => {
                ready(this.context, () => {
                    res.locals.webpackStats = this.context.webpackStats
                    resolve(next())
                }, req)
            }))
        }

        if (req.method !== 'GET') {
            return goNext()
        }

        let filename = getFilenameFromUrl(this.context.options.publicPath, this.context.compiler, req.url)

        if (filename === false) {
            return goNext()
        }

        return new Promise(((resolve) => {
            handleRequest(this.context, filename, processRequest, req)
            function processRequest() {
                try {
                    let stat = this.context.fs.statSync(filename)

                    if (!stat.isFile()) {
                        if (stat.isDirectory()) {
                            let { index } = this.context.options

                            if (index === undefined || index === true) {
                                index = 'index.html'
                            } else if (!index) {
                                throw new DevMiddlewareError('next')
                            }

                            filename = urlJoin(filename, index)
                            stat = this.context.fs.statSync(filename)
                            if (!stat.isFile()) {
                                throw new DevMiddlewareError('next')
                            }
                        } else {
                            throw new DevMiddlewareError('next')
                        }
                    }
                } catch (e) {
                    return resolve(goNext())
                }

                // server content
                let content = this.context.fs.readFileSync(filename)
                content = handleRangeHeaders(content, req, res)

                let contentType = mime.getType(filename)

                // do not add charset to WebAssembly files, otherwise compileStreaming will fail in the client
                if (!/\.wasm$/.test(filename)) {
                    contentType += '; charset=UTF-8'
                }

                res.setHeader('Content-Type', contentType)
                res.setHeader('Content-Length', content.length)

                const { headers } = this.context.options
                if (headers) {
                    for (const name in headers) {
                        if ({}.hasOwnProperty.call(headers, name)) {
                            res.setHeader(name, this.context.options.headers[name])
                        }
                    }
                }
                // Express automatically sets the statusCode to 200, but not all servers do (Koa).
                res.statusCode = res.statusCode || 200
                if (res.send) res.send(content)
                else res.end(content)
                resolve()
            }
        }))
    }

    middleware.prototype.close = function(callback){
        callback = callback || noop
        let context = this.ConfigStore[this.req.name].context
        if (context.watching) {
            context.watching.close(callback)
        } else {
            callback()
        }
    }

    middleware.prototype.fileStystem = this.configStore.configShelt[this.req.name].context.fs

    return middleware
}

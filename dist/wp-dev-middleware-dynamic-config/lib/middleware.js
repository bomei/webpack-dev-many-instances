'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mime = require('mime');
var urlJoin = require('url-join');
var DevMiddlewareError = require('./DevMiddlewareError');

var _require = require('./util'),
    getFilenameFromUrl = _require.getFilenameFromUrl,
    handleRangeHeaders = _require.handleRangeHeaders,
    handleRequest = _require.handleRequest,
    ready = _require.ready,
    noop = _require.noop;

module.exports = function wrapper(configStore) {
    function middleware(req, res, next) {
        var _this2 = this;

        if (!(req.name in configStore.configShelt)) {
            next();
        }

        this.context = configStore[req.name].context;

        res.locals = res.locals || {};

        function goNext() {
            var _this = this;

            if (!this.context.options.serverSideRender) {
                return next();
            }

            return new _promise2.default(function (resolve) {
                ready(_this.context, function () {
                    res.locals.webpackStats = _this.context.webpackStats;
                    resolve(next());
                }, req);
            });
        }

        if (req.method !== 'GET') {
            return goNext();
        }

        var filename = getFilenameFromUrl(this.context.options.publicPath, this.context.compiler, req.url);

        if (filename === false) {
            return goNext();
        }

        return new _promise2.default(function (resolve) {
            handleRequest(_this2.context, filename, processRequest, req);
            function processRequest() {
                try {
                    var stat = this.context.fs.statSync(filename);

                    if (!stat.isFile()) {
                        if (stat.isDirectory()) {
                            var index = this.context.options.index;


                            if (index === undefined || index === true) {
                                index = 'index.html';
                            } else if (!index) {
                                throw new DevMiddlewareError('next');
                            }

                            filename = urlJoin(filename, index);
                            stat = this.context.fs.statSync(filename);
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

                var content = this.context.fs.readFileSync(filename);
                content = handleRangeHeaders(content, req, res);

                var contentType = mime.getType(filename);

                if (!/\.wasm$/.test(filename)) {
                    contentType += '; charset=UTF-8';
                }

                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Length', content.length);

                var headers = this.context.options.headers;

                if (headers) {
                    for (var name in headers) {
                        if ({}.hasOwnProperty.call(headers, name)) {
                            res.setHeader(name, this.context.options.headers[name]);
                        }
                    }
                }

                res.statusCode = res.statusCode || 200;
                if (res.send) res.send(content);else res.end(content);
                resolve();
            }
        });
    }

    middleware.prototype.close = function (callback) {
        callback = callback || noop;
        var context = this.ConfigStore[this.req.name].context;
        if (context.watching) {
            context.watching.close(callback);
        } else {
            callback();
        }
    };

    middleware.prototype.fileStystem = this.configStore.configShelt[this.req.name].context.fs;

    return middleware;
};
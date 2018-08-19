'use strict';

var _require = require('url'),
    parse = _require.parse;

var querystring = require('querystring');
var pathabs = require('path-is-absolute');
var parseRange = require('range-parser');
var urlJoin = require('url-join');

var HASH_REGEXP = /[0-9a-f]{10,}/;

function getPaths(publicPath, compiler, url) {
    var compilers = compiler && compiler.compilers;
    if (Array.isArray(compilers)) {
        var compilerPublicPath = void 0;

        var compilerPublicPathBase = void 0;

        for (var i = 0; i < compilers.length; i++) {
            compilerPublicPath = compilers[i].options && compilers[i].options.output && compilers[i].options.output.publicPath;

            if (compilerPublicPath) {
                if (compilerPublicPath.indexOf('/') === 0) {
                    compilerPublicPathBase = compilerPublicPath;
                } else {
                    compilerPublicPathBase = parse(compilerPublicPath).pathname;
                }

                if (url.indexOf(compilerPublicPathBase) === 0) {
                    return {
                        publicPath: compilerPublicPath,
                        outputPath: compilers[i].outputPath
                    };
                }
            }
        }
    }
    return {
        publicPath: publicPath,
        outputPath: compiler.outputPath
    };
}

function ready(context, fn, req) {
    if (context.state) {
        return fn(context.webpackStats);
    }

    context.log.info('wait until bundle finished: ' + (req.url || fn.name));
    context.callbacks.push(fn);
}

module.exports = {
    getFilenameFromUrl: function getFilenameFromUrl(pubPath, compiler, url) {
        var _getPaths = getPaths(pubPath, compiler, url),
            outputPath = _getPaths.outputPath,
            publicPath = _getPaths.publicPath;

        var localPrefix = parse(publicPath || '/', false, true);
        var urlObject = parse(url);
        var filename = void 0;

        if (localPrefix.hostname !== null && urlObject.hostname !== null && localPrefix.hostname !== urlObject.hostname) {
            return false;
        }

        if (publicPath && localPrefix.hostname === urlObject.hostname && url.indexOf(publicPath) !== 0) {
            return false;
        }

        if (urlObject.pathname.indexOf(localPrefix.pathname) === 0) {
            filename = urlObject.pathname.substr(localPrefix.pathname.length);
        }

        if (!urlObject.hostname && localPrefix.hostname && url.indexOf(localPrefix.path) !== 0) {
            return false;
        }

        var uri = outputPath;

        if (process.platform === 'win32') {
            if (filename) {
                uri = urlJoin(outputPath || '', querystring.unescape(filename));

                if (!pathabs.win32(uri)) {
                    uri = '/' + uri;
                }
            }

            return uri;
        }

        if (filename) {
            uri = urlJoin(outputPath || '', filename);

            if (!pathabs.posix(uri)) {
                uri = '/' + uri;
            }
        }

        return querystring.unescape(uri);
    },
    handleRangeHeaders: function handleRangeHeaders(content, req, res) {
        res.setHeader('Accept-Ranges', 'bytes');

        if (req.headers.range) {
            var ranges = parseRange(content.length, req.headers.range);

            if (ranges === -1) {
                res.setHeader('Content-Range', 'bytes */' + content.length);
                res.statusCode = 416;
            }

            if (ranges !== -2 && ranges.length === 1) {
                var _content = content,
                    length = _content.length;

                res.statusCode = 206;
                res.setHeader('Content-Range', 'bytes ' + ranges[0].start + '-' + ranges[0].end + '/' + length);

                content = content.slice(ranges[0].start, ranges[0].end + 1);
            }
        }

        return content;
    },
    handleRequest: function handleRequest(context, filename, processRequest, req) {
        if (context.options.lazy && (!context.options.filename || context.options.filename.test(filename))) {
            context.rebuild();
        }

        if (HASH_REGEXP.test(filename)) {
            try {
                if (context.fs.statSync(filename).isFile()) {
                    processRequest();
                    return;
                }
            } catch (e) {}
        }

        ready(context, processRequest, req);
    },


    noop: function noop() {},

    ready: ready
};
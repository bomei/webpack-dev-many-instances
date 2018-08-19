'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mime = require('mime');
var createContext = require('./lib/context');
var middleware = require('./lib/middleware');
var reporter = require('./lib/reporter');

var _require = require('./lib/fs'),
    setFs = _require.setFs,
    toDisk = _require.toDisk;

var _require2 = require('./lib/util'),
    getFilenameFromUrl = _require2.getFilenameFromUrl,
    noop = _require2.noop,
    ready = _require2.ready;

require('loud-rejection/register');

var defaults = {
    logLevel: 'info',
    logTime: false,
    logger: null,
    mimeTypes: null,
    reporter: reporter,
    stats: {
        colors: true,
        context: process.cwd()
    },
    watchOptions: {
        aggregateTimeout: 200
    },
    writeToDisk: false
};

module.exports = function wdm(compiler, opts) {
    var options = (0, _assign2.default)({}, defaults, opts);

    if (options.lazy) {
        if (typeof options.filename === 'string') {
            var filename = options.filename.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/\\\[[a-z]+\\\]/ig, '.+');

            options.filename = new RegExp('^[/]{0,1}' + filename + '$');
        }
    }

    if (options.mimeTypes) {
        mime.define(options.mimeTypes);
    }

    var context = createContext(compiler, options);

    if (!options.lazy) {
        var watching = compiler.watch(options.watchOptions, function (err) {
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

    setFs(context, compiler);

    var res = (0, _assign2.default)(middleware(context), {
        close: function close(callback) {
            callback = callback || noop;

            if (context.watching) {
                context.watching.close(callback);
            } else {
                callback();
            }
        },


        context: context,

        fileSystem: context.fs,

        getFilenameFromUrl: getFilenameFromUrl.bind(this, context.options.publicPath, context.compiler),

        invalidate: function invalidate(callback) {
            callback = callback || noop;
            if (context.watching) {
                ready(context, callback, {});
                context.watching.invalidate();
            } else {
                callback();
            }
        },
        waitUntilValid: function waitUntilValid(callback) {
            callback = callback || noop;
            ready(context, callback, {});
        }
    });
    console.log();
    return res;
};
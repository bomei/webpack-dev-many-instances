'use strict';

var weblog = require('webpack-log');

module.exports = function ctx(compiler, options) {
    var context = {
        state: false,
        webpackStats: null,
        callbacks: [],
        options: options,
        compiler: compiler,
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

    var log = context.log;


    function done(stats) {
        context.state = true;
        context.webpackStats = stats;

        process.nextTick(function () {
            if (!context.state) {
                return;
            }

            context.options.reporter(context.options, {
                log: log,
                state: true,
                stats: stats
            });

            var cbs = context.callbacks;
            context.callbacks = [];
            cbs.forEach(function (cb) {
                cb(stats);
            });
        });

        if (context.forceRebuild) {
            context.forceRebuild = false;
            rebuild();
        }
    }

    function invalid(callback) {
        if (context.state) {
            context.options.reporter(context.options, {
                log: log,
                state: false
            });
        }

        context.state = false;
        if (typeof callback === 'function') {
            callback();
        }
    }

    function rebuild() {
        if (context.state) {
            context.state = false;
            context.compiler.run(function (err) {
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
    context.compiler.hooks.watchRun.tap('WebpackDevMiddleware', function (comp, callback) {
        invalid(callback);
    });

    return context;
};
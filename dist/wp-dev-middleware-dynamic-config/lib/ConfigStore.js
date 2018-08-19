'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConfigStore = undefined;

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mime = require('mime');
var webpack = require('webpack');
var createContext = require('./context');
var reporter = require('./reporter');

var _require = require('./fs'),
    setFs = _require.setFs,
    toDisk = _require.toDisk;

function configComplilerContext(config, opts) {

    var options = (0, _assign2.default)({}, defaults, opts);
    var compiler = webpack(config);

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

    return {
        config: config,
        compiler: compiler,
        context: context
    };
}

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

var ConfigStore = exports.ConfigStore = function () {
    function ConfigStore() {
        (0, _classCallCheck3.default)(this, ConfigStore);

        this.configShelt = new _map2.default();
    }

    (0, _createClass3.default)(ConfigStore, [{
        key: 'addConfig',
        value: function addConfig(config, opts) {
            this.configShelf.set('hello', config);
        }
    }]);
    return ConfigStore;
}();
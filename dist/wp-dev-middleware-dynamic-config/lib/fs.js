'use strict';

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['{cyan Asset written to disk}: ', ''], ['{cyan Asset written to disk}: ', '']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var MemoryFileSystem = require('memory-fs');
var pathabs = require('path-is-absolute');

var _require = require('webpack-log'),
    chalk = _require.chalk;

var NodeOutputFileSystem = require('webpack/lib/node/NodeOutputFileSystem');
var DevMiddlewareError = require('./DevMiddlewareError');

var _ref = new NodeOutputFileSystem(),
    mkdirp = _ref.mkdirp;

module.exports = {
    toDisk: function toDisk(context) {
        var compilers = context.compiler.compilers || [context.compiler];

        var _loop = function _loop(compiler) {
            compiler.hooks.afterEmit.tap('WebpackDevMiddleware', function (compilation) {
                var assets = compilation.assets;
                var log = context.log;
                var filter = context.options.writeToDisk;
                var outputPath = compiler.outputPath;


                if (outputPath === '/') {
                    outputPath = compiler.context;
                }

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = (0, _getIterator3.default)((0, _keys2.default)(assets)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var assetPath = _step2.value;

                        var asset = assets[assetPath];
                        var source = asset.source();
                        var isAbsolute = pathabs(assetPath);
                        var writePath = isAbsolute ? assetPath : path.join(outputPath, assetPath);
                        var relativePath = path.relative(process.cwd(), writePath);
                        var allowWrite = filter && typeof filter === 'function' ? filter(writePath) : true;

                        if (allowWrite) {
                            var output = source;

                            mkdirp.sync(path.dirname(writePath));

                            if (Array.isArray(source)) {
                                output = source.join('\n');
                            }

                            try {
                                fs.writeFileSync(writePath, output, 'utf-8');
                                log.debug(chalk(_templateObject, relativePath));
                            } catch (e) {
                                log.error('Unable to write asset to disk:\n' + e);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(compilers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var compiler = _step.value;

                _loop(compiler);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },
    setFs: function setFs(context, compiler) {
        if (typeof compiler.outputPath === 'string' && !pathabs.posix(compiler.outputPath) && !pathabs.win32(compiler.outputPath)) {
            throw new DevMiddlewareError('`output.path` needs to be an absolute path or `/`.');
        }

        var fileSystem = void 0;

        var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;

        if (isMemoryFs) {
            fileSystem = compiler.outputFileSystem;
        } else {
            fileSystem = new MemoryFileSystem();
            compiler.outputFileSystem = fileSystem;
        }

        context.fs = fileSystem;
    }
};
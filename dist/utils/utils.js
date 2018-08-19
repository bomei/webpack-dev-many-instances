'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageConfig = require('../package.json');

exports.assetsPath = function (_path) {
    var assetsSubDirectory = 'static';

    return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
    options = options || {};

    var cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    var postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    function generateLoaders(loader, loaderOptions) {
        var loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: (0, _assign2.default)({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            });
        } else {
            return ['vue-style-loader'].concat(loaders);
        }
    }

    return {
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),

        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
};

exports.styleLoaders = function (options) {
    var output = [];
    var loaders = exports.cssLoaders(options);

    for (var extension in loaders) {
        var loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }

    return output;
};

exports.createNotifierCallback = function () {
    var notifier = require('node-notifier');

    return function (severity, errors) {
        if (severity !== 'error') return;

        var error = errors[0];
        var filename = error.file && error.file.split('!').pop();

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        });
    };
};
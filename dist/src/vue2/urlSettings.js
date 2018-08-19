'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlSettings = new _vue2.default({
    data: {
        app: null,
        urlParams: {}
    },
    methods: {
        init: function init(app) {
            var _this = this;

            for (var _len = arguments.length, settings = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                settings[_key - 1] = arguments[_key];
            }

            settings.forEach(function (setting) {
                _vue2.default.set(_this.urlParams, setting, app[setting]);
                app.$watch(setting, function (newValue) {
                    _vue2.default.set(_this.urlParams, setting, newValue);
                });
            });
            this.app = app;
        },
        parseToUrl: function parseToUrl(params) {
            if ((0, _stringify2.default)(params) === '{}') {
                return '';
            } else {
                var str = '';
                for (var param in params) {
                    if (params[param] !== '' && params[param] !== undefined) {
                        str += param + '=' + params[param] + '&';
                    }
                }
                str = str.slice(0, str.length - 1);
                var href = window.location.href;

                if (href.includes('version=')) {
                    var version = href.split('version=')[1].split('&')[0];
                    str = '?version=' + version + '&' + str;
                } else {
                    str = '?' + str;
                }
                if (href.includes('inside=true')) {
                    str += '&inside=true';
                }
                return str;
            }
        },

        resolveUrlParams: function resolveUrlParams(urlParams) {
            var match = void 0,
                pl = /\+/g,
                search = /([^&=]+)=?([^&]*)/g,
                decode = function decode(s) {
                return decodeURIComponent(s.replace(pl, ' '));
            },
                query = window.location.search.substring(1);
            if (match = search.exec(query)) urlParams[decode(match[1])] = decode(match[2]);
        }
    },
    watch: {
        urlParams: {
            handler: function handler(newP) {
                window.history.pushState({}, 0, this.parseToUrl(this.urlParams));
            },
            deep: true
        }
    },
    mounted: function mounted() {
        this.resolveUrlParams(this.urlParams);
    }
});

exports.default = urlSettings;
'use strict';

var _urlSettings = require('./urlSettings');

var _urlSettings2 = _interopRequireDefault(_urlSettings);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function urlGet(name, defaualt) {
    var search = window.location.search;
    var dict = {};
    if (search !== '') {
        search.slice(1).split('&').forEach(function (item) {
            var param = item.split('=');
            if (param[0] === name) {
                return param[1];
            }
        });
    }
    return defaualt;
}
var app = new _vue2.default({
    el: '#app',
    data: {
        ymls: ['basic', 'quote', 'trade'],
        selectedYml: 'basic',
        url: undefined,
        version: undefined
    },
    watch: {
        selectedYml: function selectedYml() {
            var url = '/swagger/' + this.selectedYml + '.yml';
            if (this.url !== url) {
                var href = '/swagger?url=' + url;
                if (this.version) {
                    href = href;
                }
            }
        }
    },
    methods: {
        ymlSelected: function ymlSelected() {}
    },
    mounted: function mounted() {
        var search = window.location.search;
        var self = this;
        if (search !== '') {
            search.slice(1).split('&').forEach(function (item) {
                var param = item.split('=');
                if (param[0] === 'url') {
                    self.url = param[1];
                }
                if (param[0] === 'version') {
                    self.version = param[1];
                }
            });
        }
        if (!this.url) {
            this.url = '/r/swagger/quote.yml';
        }
        var file = this.url.substring(this.url.lastIndexOf('/') + 1);
        this.selectedYml = file.substring(0, file.lastIndexOf('.'));
        var url = '/r/swagger/' + this.selectedYml + '.yml';
        if (search !== '' && search.includes('?api=')) {
            url = search.split('?api=')[1];
        }
        var ui = SwaggerUIBundle({
            url: url,
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
            plugins: [SwaggerUIBundle.plugins.DownloadUrl],
            layout: 'StandaloneLayout'
        });
        window.ui = ui;
        var x = $('.topbar');
        x.hide();
    }
});
_urlSettings2.default.init(app, 'url');
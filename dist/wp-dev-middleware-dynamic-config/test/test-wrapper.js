'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapper = require('../lib/middleware');
var ConfigStore = require('../lib/ConfigStore');
var config = require('../../configs/webpack.config.vue1');

var cs = (0, _create2.default)(ConfigStore);

cs.addConfig(config);

console.log(cs);

var WB = function () {
  function WB(req, res, next) {
    (0, _classCallCheck3.default)(this, WB);

    this.req = req;
    console.log(req, res, next);
  }

  (0, _createClass3.default)(WB, [{
    key: 'close',
    value: function close() {
      console.log(this.req);
    }
  }]);
  return WB;
}();
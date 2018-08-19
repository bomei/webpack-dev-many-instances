'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (_Error) {
  (0, _inherits3.default)(DevMiddlewareError, _Error);

  function DevMiddlewareError() {
    (0, _classCallCheck3.default)(this, DevMiddlewareError);
    return (0, _possibleConstructorReturn3.default)(this, (DevMiddlewareError.__proto__ || (0, _getPrototypeOf2.default)(DevMiddlewareError)).apply(this, arguments));
  }

  return DevMiddlewareError;
}(Error);
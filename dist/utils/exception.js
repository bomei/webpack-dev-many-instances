'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BoException = function () {
    function BoException(message, detail) {
        (0, _classCallCheck3.default)(this, BoException);

        this.message = message;
        this.name = 'BoException';
        this.detail = detail ? detail : '';
    }

    (0, _createClass3.default)(BoException, [{
        key: 'toString',
        value: function toString() {
            return (0, _stringify2.default)({
                name: this.name,
                detail: this.detail,
                message: this.message
            });
        }
    }]);
    return BoException;
}();

module.exports.BoException = BoException;
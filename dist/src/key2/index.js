'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _printMe = require('./printMe.js');

var _printMe2 = _interopRequireDefault(_printMe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = document.getElementById('app');
var mark = document.getElementById('mark');
mark.innerHTML = '2222222222';
function updateApp() {
  app.innerHTML = (0, _printMe2.default)();
}

if (module.hot) {
  module.hot.accept('./printMe.js', function () {
    console.log('Accepting the updated printMe module!');
    updateApp();
  });
}
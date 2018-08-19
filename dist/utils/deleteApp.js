'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var deleteApp = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(name) {
        var target, _ref2, stdout, stderr;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('Deleting app -- ' + name + '...');
                        target = './configs/webpack.config.' + name + '.js';
                        _context.next = 4;
                        return fileExists(target);

                    case 4:
                        if (_context.sent) {
                            _context.next = 6;
                            break;
                        }

                        throw new BoException('No such app called ' + name, 'Config for ' + name + ' hasn\'t existed, please check the appname.');

                    case 6:
                        _context.next = 8;
                        return shell.exec('rm -r ./src/' + name + '&rm ./configs/webpack.config.' + name + '.js');

                    case 8:
                        _ref2 = _context.sent;
                        stdout = _ref2.stdout;
                        stderr = _ref2.stderr;

                        if (stderr) {
                            _context.next = 16;
                            break;
                        }

                        console.log('Finish to remove app -- ' + name);
                        return _context.abrupt('return', stdout);

                    case 16:
                        throw new BoException('Copy src file error', stderr);

                    case 17:
                        return _context.abrupt('return');

                    case 18:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function deleteApp(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var xtpl = require('xtpl');
var argv = require('yargs').argv;
var shell = require('async-shelljs');

var _require = require('util'),
    promisify = _require.promisify;

var _require2 = require('./exception'),
    BoException = _require2.BoException;

var renderFile = promisify(xtpl.renderFile);
var fileExists = promisify(fs.exists);
var writeFile = promisify(fs.writeFile);

var name = argv.name;

if (!name) {
    console.log('--name is required');
    shell.exit(0);
}

deleteApp(name).then(function (stdout) {
    console.log(stdout);
}).catch(function (err) {
    return console.log(err);
});
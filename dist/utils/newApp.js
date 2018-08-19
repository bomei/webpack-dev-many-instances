'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var renderConfig = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(type, name) {
        var target, configTemplateFileName, content, res;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('Generatintg new config file for ' + name + '...');
                        target = './configs/webpack.config.' + name + '.js';
                        _context.next = 4;
                        return fileExists(target);

                    case 4:
                        if (!_context.sent) {
                            _context.next = 6;
                            break;
                        }

                        throw new BoException('File exists', 'Config for ' + name + ' has existed, please try another appname.');

                    case 6:
                        configTemplateFileName = './templates/new.config.' + type + '.xtpl.js';
                        content = void 0;
                        _context.prev = 8;
                        _context.next = 11;
                        return renderFile(configTemplateFileName, {
                            appName: '\'' + name + '\''
                        });

                    case 11:
                        content = _context.sent;
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](8);
                        throw new BoException('Xtpl render error', _context.t0);

                    case 17:
                        _context.prev = 17;
                        res = true;
                        _context.next = 21;
                        return writeFile(target, content);

                    case 21:
                        res = _context.sent;

                        if (!res) console.log('Write config to ' + target + ' OK.');
                        _context.next = 28;
                        break;

                    case 25:
                        _context.prev = 25;
                        _context.t1 = _context['catch'](17);
                        throw new BoException('Write file error', _context.t1);

                    case 28:
                        return _context.abrupt('return');

                    case 29:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[8, 14], [17, 25]]);
    }));

    return function renderConfig(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var copySrcFiles = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(name, type) {
        var _ref3, stdout, stderr;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        console.log('Moving src files to ./src/' + name);
                        _context2.next = 3;
                        return shell.exec('cp -r ./templates/new.src.' + type + ' ./src/' + name);

                    case 3:
                        _ref3 = _context2.sent;
                        stdout = _ref3.stdout;
                        stderr = _ref3.stderr;

                        if (stderr) {
                            _context2.next = 11;
                            break;
                        }

                        console.log('Moving ' + name + ' files to finished.');
                        return _context2.abrupt('return', stdout);

                    case 11:
                        throw new BoException('Copy src file error', stderr);

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function copySrcFiles(_x3, _x4) {
        return _ref2.apply(this, arguments);
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

var name = argv.name,
    type = argv.type;

if (!name) {
    console.log('--name is required');
    shell.exit(0);
}
if (!type) type = 'default';

renderConfig(type, name).then(function () {
    copySrcFiles(name, type).then(function (stdout) {
        return console.log(stdout);
    }).catch(function (err) {
        return console.log(err);
    });
}).catch(function (err) {
    return console.log(err);
});
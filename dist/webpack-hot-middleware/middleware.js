'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = webpackHotMiddleware;

function pathMatch(path) {

  var regex = /\/ws\/(.*)\/__webpack_hmr/;

  var res = regex.exec(path);

  return res === null ? null : res[1];
}

function webpackHotMiddleware(compiler, opts) {
  opts = opts || {};
  opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
  opts.path = opts.path || '/__webpack_hmr';
  opts.heartbeat = opts.heartbeat || 10 * 1000;

  var eventStream = createEventStream(opts.heartbeat);
  var latestStats = null;
  var lastStats = null;
  var lastBundles = null;

  if (compiler.hooks) {
    compiler.hooks.invalid.tap("webpack-hot-middleware", onInvalid);
    compiler.hooks.done.tap("webpack-hot-middleware", onDone);
  } else {
    compiler.plugin("invalid", onInvalid);
    compiler.plugin("done", onDone);
  }
  function onInvalid() {
    latestStats = null;
    if (opts.log) opts.log("webpack building...");
    eventStream.publish({ action: "building" });
  }
  function onDone(statsResult) {
    latestStats = statsResult;
    var thisBundles = extractBundles(statsResult.toJson());
    var updatedBundles = filterModifiedBundles(lastBundles, thisBundles);
    lastBundles = thisBundles;
    opts.log('lastStats-----\n', lastStats);

    publishStats("built", updatedBundles, eventStream, opts.log);
  }

  function filterModifiedBundles(lastBundles, thisBundles) {
    if (lastBundles === null) return thisBundles;
    var updatedBundles = Object();
    (0, _keys2.default)(thisBundles).forEach(function (name) {
      if (lastBundles[name] === undefined || lastBundles[name].hash != thisBundles[name].hash) {
        updatedBundles[name] = thisBundles[name];
      }
    });
    return updatedBundles;
  }

  var middleware = function middleware(req, res, next) {
    var url = req.url;
    var appName = pathMatch(url);

    if (appName === null) return next();else req.appName = appName;

    eventStream.handler(req, res);
    if (latestStats) {

      publishStats("sync", extractBundles(latestStats.toJson()), eventStream);
    }
  };
  middleware.publish = eventStream.publish;
  return middleware;
}

function createEventStream(heartbeat) {
  var clientId = 0;
  var clients = Object();
  function everyClient(fn) {
    (0, _keys2.default)(clients).forEach(function (id) {
      fn(clients[id]);
    });
  }
  setInterval(function heartbeatTick() {
    everyClient(function (client) {
      client.write('data: \uD83D\uDC93\n\n');
    });
  }, heartbeat).unref();
  return {
    handler: function handler(req, res) {
      req.socket.setKeepAlive(true);
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',

        'X-Accel-Buffering': 'no',
        'App-Name': req.appName
      });
      res.write('\n');
      var id = req.appName;
      clients[id] = res;

      req.on("close", function () {
        delete clients[id];
      });
    },
    publish: function publish(payload) {
      var client = clients[payload.name];
      if (client) client.write("data: " + (0, _stringify2.default)(payload) + "\n\n");
    }
  };
}

function publishStats(action, updatedBundles, eventStream, log) {
  (0, _keys2.default)(updatedBundles).forEach(function (name) {
    var stats = updatedBundles[name];

    if (log) {
      log("webpack built " + (stats.name ? stats.name + " " : "") + stats.hash + " in " + stats.time + "ms");
    }
    eventStream.publish({
      name: stats.name,
      action: action,
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules: buildModuleMap(stats.modules)
    });
  });
}

function extractBundles(stats) {
  var res = Object();

  if (stats.modules) {
    res[stats.name] = stats;
    return res;
  }

  if (stats.children && stats.children.length) {
    stats.children.forEach(function (child) {
      res[child.name] = child;
    });
    return res;
  }

  res['__unsure'] = stats;
  return res;
}

function buildModuleMap(modules) {
  var map = {};
  modules.forEach(function (module) {
    map[module.id] = module.name;
  });
  return map;
}
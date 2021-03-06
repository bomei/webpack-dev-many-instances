module.exports = webpackHotMiddleware;

function pathMatch(path){
  
  var regex = /\/ws\/(.*)\/__webpack_hmr/;
  // console.log(regex, path)
  var res = regex.exec(path);
  // console.log(res);
  return res===null? null: res[1];
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
    eventStream.publish({action: "building"});
  }
  function onDone(statsResult) {
    // if (opts.log){
    //   opts.log('lastStats-----\n',lastStats);
    //   opts.log('latestStats-----\n',latestStats);
    //   opts.log('statsResult-----\n',statsResult);
    // } 
    // opts.log(lastStats.toJSON({}))
    // opts.log(lastStats.stats === statsResult.stats)
    // Keep hold of latest stats so they can be propagated to new clients
    latestStats = statsResult;
    var thisBundles = extractBundles(statsResult.toJson());
    var updatedBundles = filterModifiedBundles(lastBundles,thisBundles)
    lastBundles = thisBundles;
    opts.log('lastStats-----\n',lastStats);
    // if (opts.log) opts.log(statsResult);
    publishStats("built", updatedBundles, eventStream, opts.log);
  }

  function filterModifiedBundles(lastBundles, thisBundles){
    if (lastBundles === null) return thisBundles;
    var updatedBundles=Object();
    Object.keys(thisBundles).forEach(function(name){
      if (lastBundles[name]===undefined || lastBundles[name].hash!=thisBundles[name].hash){
        updatedBundles[name]=thisBundles[name]
      }
    })
    return updatedBundles;
  }

  var middleware = function(req, res, next) {
    // console.log(req.path, req.url)
    var url = req.url;
    var appName = pathMatch(url);
    // console.log(appName)
    if (appName === null) return next();
    else req.appName = appName;
    // if (req.path != '/_whaaat') console.log(req);
    eventStream.handler(req, res);
    if (latestStats) {
      // Explicitly not passing in `log` fn as we don't want to log again on
      // the server
      
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
    Object.keys(clients).forEach(function(id) {
      fn(clients[id]);
    });
  }
  setInterval(function heartbeatTick() {
    everyClient(function(client) {
      client.write("data: \uD83D\uDC93\n\n");
    });
  }, heartbeat).unref();
  return {
    handler: function(req, res) {
      // console.log(req.appName);
      req.socket.setKeepAlive(true);
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        // While behind nginx, event stream should not be buffered:
        // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
        'X-Accel-Buffering': 'no',
        'App-Name': req.appName
      });
      res.write('\n');
      var id = req.appName;
      clients[id] = res;
      // console.log(clients);
      req.on("close", function(){
        delete clients[id];
      });
    },
    publish: function(payload) {
      // everyClient(function(client) {
      //   client.write("data: " + JSON.stringify(payload) + "\n\n");
      // });
      var client = clients[payload.name];
      if (client)
        client.write("data: " + JSON.stringify(payload) + "\n\n");
    }
  };
}

function publishStats(action, updatedBundles, eventStream, log) {
  // For multi-compiler, stats will be an object with a 'children' array of stats
  // var bundles = extractBundles(statsResult.toJson({ errorDetails: false }));
  // console.log(updatedBundles)
  Object.keys(updatedBundles).forEach(function(name) {
    var stats = updatedBundles[name]
    // console.log(stats)
    if (log) {
      log("webpack built " + (stats.name ? stats.name + " " : "") +
        stats.hash + " in " + stats.time + "ms");
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
  var res=Object()
  // Stats has modules, single bundle
  if (stats.modules) {
    res[stats.name]=stats;
    return res;
  }

  // Stats has children, multiple bundles
  if (stats.children && stats.children.length){
    stats.children.forEach(function(child){
      res[child.name]=child;
    })
    return res;
  } 

  // Not sure, assume single
  res['__unsure']=stats;
  return res;
}

function buildModuleMap(modules) {
  var map = {};
  modules.forEach(function(module) {
    map[module.id] = module.name;
  });
  return map;
}

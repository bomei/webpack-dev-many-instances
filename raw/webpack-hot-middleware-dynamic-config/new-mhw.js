function pathMatch(path){
  
  let regex = /\/ws\/(.*)\/__webpack_hmr/;
  // console.log(regex, path)
  let res = regex.exec(path);
  // console.log(res);
  return res===null? null: res[1];
}

export default class webpackHotMiddlewareDynamicConfig{
    constructor(compilerManager){
      this.compilerManager = compilerManager
      this.manager = new Map()
    }

    addConfig(name, opts){
      opts = opts || {};
      opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
      opts.path = opts.path || '/__webpack_hmr';
      opts.heartbeat = opts.heartbeat || 10 * 1000
      let  eventStream = new EventStream(opts.heartbeat);
      let latestStats = null;
      let lastStats = null;
      let lastBundles = null;

      this.manager.set(name,{eventStream,latestStats, lastStats, lastBundles})
      

      let {compiler} = this.compilerManager.get(name)

      if (compiler.hooks) {
        compiler.hooks.invalid.tap("webpack-hot-middleware", onInvalid);
        compiler.hooks.done.tap("webpack-hot-middleware", onDone);
      } else {
        compiler.plugin("invalid", onInvalid);
        compiler.plugin("done", onDone);
      }

      // this.compilerManager.set(name,compiler)

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
        let thisBundles = extractBundles(statsResult.toJson());
        let updatedBundles = filterModifiedBundles(lastBundles,thisBundles)
        lastBundles = thisBundles;
        // opts.log('lastStats-----\n',lastStats);
        // if (opts.log) opts.log(statsResult);
        publishStats("built", updatedBundles, eventStream, opts.log);
      }
    
      function filterModifiedBundles(lastBundles, thisBundles){
        if (lastBundles === null) return thisBundles;
        let updatedBundles=Object();
        Object.keys(thisBundles).forEach(function(name){
          if (lastBundles[name]===undefined || lastBundles[name].hash!=thisBundles[name].hash){
            updatedBundles[name]=thisBundles[name]
          }
        })
        return updatedBundles;
      }
    }

    middleware(req, res,next){
      let url = req.url
      let appName = pathMatch(url)
      if(appName === null) return next()
      else {
        if (!req.appName) req.appName=appName
      }
      let {eventStream, latestStats} = this.manager.get(appName)
      eventStream.handler(req,res)
      if(latestStats){
        publishStats('sync',extractBundles(latestStats.toJson()), eventStream)
      }
    }
}

class EventStream{
  constructor(heartbeat){
    this.heartbeat=heartbeat
    this.clients = new Map()

    this.interval = setInterval(()=>{
      this.everyClient((client)=>{
        client.write("data: \uD83D\uDC93\n\n")
      })
    }, heartbeat)

  }

  everyClient(fn){
    this.clients.forEach((client)=>{
      fn(client)
    })
  }

  handler(req, res){
    req.socket.setKeepAlive(true)
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream;charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // While behind nginx, event stream should not be buffered:
      // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
      'X-Accel-Buffering': 'no',
      'App-Name': req.appName
    })
    res.write('\n');
      let appName = req.appName;
      this.clients.set(appName,res)
      // console.log(clients);
      req.on("close", ()=>{
        this.clients.delete(appName)
      })
  }

  publish(payload){
    let client = this.clients.get(payload.name)
    if(client){
      client.write("data: " + JSON.stringify(payload) + "\n\n")
    }
  }
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
  var outputPath = stats.outputPath.split('\\')
  var name = outputPath[outputPath.length-1]
  stats.name = stats.name || name
  if (stats.modules) {
    res[stats.name]=stats;
    return res;
  }

  // // Stats has children, multiple bundles
  // if (stats.children && stats.children.length){
  //   stats.children.forEach(function(child){
  //     res[child.name]=child;
  //   })
  //   return res;
  // } 

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
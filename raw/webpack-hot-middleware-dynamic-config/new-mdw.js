function pathMatch(path){
  
  let regex = /\/ws\/(.*)\/__webpack_hmr/;
  // console.log(regex, path)
  let res = regex.exec(path);
  // console.log(res);
  return res===null? null: res[1];
}

class webpackHotMiddlewareDynamicConfig{
    constructor(compilerManager){
      this.compilerManager = compilerManager
    }

    addConfig(config, opts){
      opts = opts || {};
      opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
      opts.path = opts.path || '/__webpack_hmr';
      opts.heartbeat = opts.heartbeat || 10 * 1000

      let  eventStream = createEventStream(opts.heartbeat);
      let latestStats = null;
      let lastStats = null;
      let lastBundles = null;

      let {compiler} = this.compilerManager.get(config.name)

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
    }

    middleware(req, res,next){

    }
}

class EventStream{
  constructor(heartbeat){
    this.heartbeat=heartbeat
    this.clients = new Map()
    this.interval = setInterval(()=>{
      this.everyClient
    })
  }

  everyClient(fn){
    this.clients.forEach((client)=>{
      fn(client)
    })
  }
}
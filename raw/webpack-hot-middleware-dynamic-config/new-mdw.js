module.exports = webpackHotMiddlewareDynamicConfig

function pathMatch(path){
  
  var regex = /\/ws\/(.*)\/__webpack_hmr/;
  // console.log(regex, path)
  var res = regex.exec(path);
  // console.log(res);
  return res===null? null: res[1];
}

function webpackHotMiddlewareDynamicConfig(configManager){
  
}
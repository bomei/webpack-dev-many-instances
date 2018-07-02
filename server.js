const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// const config2 = require('./webpack.config2')
// const compiler2 = webpack(config2)
// __webpack_public_path__ = `http://localhost/vue`

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(webpackDevMiddleware(compiler2, {
  // noInfo: true,
//   publicPath: config.output.publicPath
// }));

// app.use(require("webpack-hot-middleware")(compiler2,{
//   log: false,
//   path:"/key2/_whaaat",
// }));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  // lazy: true
  // publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler,{
  log: false,
  path:"/_whaaat",
  // hotUpdateChunkFilename: '[hash].hot-update.js',
  // hotUpdateMainFilename:'[hash].hot-update.json'
}));





// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
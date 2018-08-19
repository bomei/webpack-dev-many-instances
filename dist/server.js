'use strict';

var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var app = express();
var config = require('./webpack.config');
var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    hot: true,
    stats: {
        colors: true,
        children: true
    }
}));

app.use(require('./dist/webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/_whaaat'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/new', upload.array(), function (req, res) {
    console.log(req);
    res.send('express get this response');
});

app.listen(5000, function () {
    console.log('Example app listening on port 5000!\n');
});
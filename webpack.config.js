//webpack config
var webpack = require('webpack'),
path = require('path');
var devConfig = require('./webpack.development');
var prodConfig = require('./webpack.production');
//
var isDev = process.env.NODE_ENV;
console.log(isDev);
var exportConfig;

const enumType ={
"development":devConfig,
"production":prodConfig,
};


exportConfig = enumType[isDev];
module.exports = exportConfig;
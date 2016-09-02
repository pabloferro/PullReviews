var ENVIRONMENT = process.env.NODE_ENV || 'development';

var configFile = './' + ENVIRONMENT;

exports.config = require(configFile).config;

var nconf = require('nconf');
var ENVIRONMENT = nconf.get('NODE_ENV') || 'development';

var configFile = './' + ENVIRONMENT;

exports.config = require(configFile).config;

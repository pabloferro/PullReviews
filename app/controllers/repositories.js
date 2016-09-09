var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    github  = require('../services/github');

exports.index = function (req, res) {
    res.send(req.authentication);
};

exports.create = function (req, res) {
    res.send(req.body.name);
};

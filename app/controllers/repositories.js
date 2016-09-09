var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    github  = require('../services/github');

exports.index = function (req, res) {
    github.get_repos(req.authentication.token).then((repos) => {
        console.log('repos: ', repos);
        res.send(repos);
    }).catch((error) => {
        console.log('repos error: ', error);
        res.send({ error });
    });
};

exports.create = function (req, res) {
    res.send(req.body.name);
};

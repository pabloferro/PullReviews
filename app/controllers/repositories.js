var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    github  = require('../services/github'),
    repos   = require('../services/repos'),
    winston = require('winston');

exports.index = function (req, res) {
    github.get_repos(req.authentication.token).then((repos) => {
        res.send(repos);
    }).catch((error) => {
        winston.error(`repos : ${error}`);
        res.send({ error });
    });
};

exports.create = function (req, res) {
    github.create_hook(req.authentication.token, req.body.repo_full_name).then((response) => {
        repos.add_repo_to_user(req.authentication.user, req.body.repo_full_name);
        res.send(response);
    }).catch((response) => {
        winston.error(`repos : ${response}`);
        res.send({ errors: response.body.errors });
    });
};

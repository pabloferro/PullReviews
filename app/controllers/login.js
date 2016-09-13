var Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    repos   = require('../services/repos'),
    winston = require('winston'),
    config  = require('../../config/config').config;

exports.github = function(req, res) {
    const options = {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            'Accept': 'application/json'
        },
        form: {
            client_id: config.github.id,
            client_secret: config.github.secret,
            code: req.body.code
        },
        json: true
    };

    request.postAsync(options).then(function(response) {
        const access_token = response.body.access_token;
        const options = {
            url: 'https://api.github.com/user',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${access_token}`,
                'User-Agent': 'PullReviews'
            },
            json: true
        };
        request.getAsync(options).then(function(response) {
            repos.save_token(response.body.login, access_token);
            res.send({
                user: response.body.login,
                access_token
            });
        });
    }).catch(function(error, response, body) {
        res.status(400).send({ error, response, body });
    });
};

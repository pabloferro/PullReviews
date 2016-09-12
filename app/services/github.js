var Promise    = require('bluebird'),
    octonode   = Promise.promisifyAll(require('octonode')),
    config     = require('../../config/config').config,
    repos      = require('./repos'),
    winston    = require('winston');

const client = function(access_token) {
    return Promise.promisifyAll(octonode.client(access_token));
};

// TODO: Remove find_user repeated code

exports.create_status = function(repo_full_name, pull_request_sha, status) {
    return repos.find_user({ repos: repo_full_name }).then((user) => {
        return client(user.token).repo(repo_full_name).statusAsync(pull_request_sha, status);
    });
};

exports.create_status_from_issue = function(repo_full_name, issue, status) {
    return repos.find_user({ repos: repo_full_name }).then((user) => {
        const ghpr = client(user.token).pr(repo_full_name, issue.number);
        return ghpr.infoAsync().then(function(pr) {
            return module.exports.create_status(repo_full_name, pr.head.sha, status);
        }).catch(function(error) {
            winston.error('GET Pull Request: ', error);
        });
    });
};

exports.get_config_file = function(repo_full_name) {
    return repos.find_user({ repos: repo_full_name }).then((user) => {
        return client(user.token).repo(repo_full_name).contentsAsync('.pullreviews.json').then(function (file) {
            return JSON.parse(Buffer.from(file.content, 'base64').toString());
        });
    });
};

exports.get_repos = function(access_token) {
    return client(access_token).me().reposAsync();
};

exports.me = function(access_token) {
    return client(access_token).meAsync();
};

exports.create_hook = function(access_token, repo_full_name) {
    return client(access_token).repo(repo_full_name).hookAsync({
        'name': 'web',
        'active': true,
        'events': ['issue_comment', 'pull_request', 'push'],
        'config': {
            'url': config.webhookUrl,
            'content_type': 'json'
        }
    });
};

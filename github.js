var Promise    = require('bluebird');
    octonode   = Promise.promisifyAll(require('octonode'));
    readConfig = require('read-config'),
    config     = readConfig('./.github.json'),
    winston    = require('winston');

const client = octonode.client(config.token);

exports.create_status = function(repo_full_name, pull_request_sha, status) {
  return client.repo(repo_full_name).statusAsync(pull_request_sha, status);
}

exports.create_status_from_issue = function(repo_full_name, issue, status) {
  const ghpr = client.pr(repo_full_name, issue.number);
  return ghpr.infoAsync().then(function(pr) {
    module.exports.create_status(repo_full_name, pr.head.sha, status);
  }).catch(function(error) {
    winston.error('GET Pull Request: ', error);
  });
}

exports.get_config_file = function(repo_full_name) {
  return client.repo(repo_full_name).contentsAsync('.pullreviews.json').then(function (file) {
    return JSON.parse(Buffer.from(file.content, 'base64').toString());
  });
}

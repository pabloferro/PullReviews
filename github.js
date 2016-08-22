var Promise    = require('bluebird');
    octonode   = Promise.promisifyAll(require('octonode'));
    readConfig = require('read-config'),
    config     = readConfig('./.github.json'),
    winston    = require('winston');

const client = octonode.client(config.token);

exports.create_status = function(repo_full_name, pull_request_sha, status) {
  var ghrepo = client.repo(repo_full_name);
  return ghrepo.statusAsync(pull_request_sha, status);
}

exports.create_status_from_pr = function(pull_request, status) {
  return module.exports.create_status(pull_request.base.repo.full_name, pull_request.head.sha, status)
}

exports.create_status_from_issue = function(repository, issue, status) {
  const ghrepo = client.repo(repository.full_name);
  const ghpr = client.pr(repository.full_name, issue.number);
  return ghpr.infoAsync().then(function(pr){
    module.exports.create_status(repository.full_name, pr.head.sha, status);
  }).catch(function(error) {
    winston.error('GET Pull Request: ', error);
  });
}

var octonode   = require('octonode');
    readConfig = require('read-config'),
    config     = readConfig('./.github.json');

const client = octonode.client(config.token);

exports.create_status = function(repo_full_name, pull_request_sha, status) {
  var ghrepo = client.repo(repo_full_name);
  ghrepo.status(pull_request_sha, status, function(err, status) {
    if (err) {
      return console.log('Create Status Error: ', err);
    }
  });
}

exports.create_status_from_pr = function(pull_request, status) {
  module.exports.create_status(pull_request.base.repo.full_name, pull_request.head.sha, status)
}

exports.create_status_from_issue = function(repository, issue, status) {
  const ghrepo = client.repo(repository.full_name);
  const ghpr = client.pr(repository.full_name, issue.number);
  ghpr.info(function(err, pr) {
    if (err) {
      return console.log('GET pr error: ', err);
    }
    module.exports.create_status(repository.full_name, pr.head.sha, status);
  });
}

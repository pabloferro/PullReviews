var github = require('octonode');

const pending_status = {
  'state': 'pending',
  'description': 'Front-end code review pending',
  'context': 'Code Review'
}

exports.process_pull_request = function(pull_request) {
  var client = github.client(GITHUB_TOKEN);
  var ghrepo = client.repo(pull_request.base.repo.full_name);
  ghrepo.status(pull_request.head.sha, pending_status, function(err, status) {
    // TODO: improve error handling => Promisify (bluebird) + middleware
    if (err) {
      return console.log('Error: ', err);
    }
  });
}

// TODO: use destructuring { comment, issue, repository }
exports.process_comment = function(comment, issue, repository) {
  const client = github.client(GITHUB_TOKEN);
  const ghrepo = client.repo(repository.full_name);
  const ghpr = client.pr(repository.full_name, issue.number);
  ghpr.info(function(err, pr) {
    if (err) {
      return console.log(err);
    }
    if (comment.body === ':+1:') {
      ghrepo.status(pr.head.sha, {
        'state': 'success',
        'description': 'Front-end code review passed',
        'context': 'code-review/pullreviews'
      }, function(...args) {
        // console.log(args);
      });
    } else if (comment.body === ':-1:') {
      ghrepo.status(pr.head.sha, {
        'state': 'failure',
        'description': 'Front-end code review failed',
        'context': 'code-review/pullreviews'
      }, function(...args) {
        // console.log(args);
      });
    }
  });
}

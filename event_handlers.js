var github = require('./github');

exports.process_pull_request = function(pull_request) {
  review_pending(pull_request.base.repo.full_name, pull_request.head.sha);
}

exports.process_push = function({ after, repository }) {
  review_pending(repository.full_name, after);
}

const review_pending = function(repository, sha) {
  return github.get_config_file(repository).then(function (config) {
    return github.create_status(repository, sha, {
      'state': 'pending',
      'description': `Code review pending by ${config.reviewersRequired} reviewers`,
      'context': 'code-review/pullreviews'
    });
  }).catch(function () {
    return github.create_status(repository, sha, {
      'state': 'pending',
      'description': `Code review pending`,
      'context': 'code-review/pullreviews'
    });
  });
}

exports.process_comment = function({ comment, issue, repository }) {
  if (comment.body.includes(':+1:')) {
    return github.create_status_from_issue(repository.full_name, issue, {
      'state': 'success',
      'description': 'Code review passed',
      'context': 'code-review/pullreviews'
    });
  } else if (comment.body.includes(':-1:')) {
    return github.create_status_from_issue(repository.full_name, issue, {
      'state': 'failure',
      'description': 'Code review failed',
      'context': 'code-review/pullreviews'
    });
  }
}

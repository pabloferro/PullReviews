var github = require('./github');

exports.process_pull_request = function(pull_request) {
  return github.create_status_from_pr(pull_request, {
    'state': 'pending',
    'description': 'Code review pending',
    'context': 'code-review/pullreviews'
  });
}

exports.process_push = function({ after, repository }) {
  return github.create_status(repository.full_name, after, {
    'state': 'pending',
    'description': 'Code review pending',
    'context': 'code-review/pullreviews'
  });
}

exports.process_comment = function({ comment, issue, repository }) {
  if (comment.body.includes(':+1:')) {
    return github.create_status_from_issue(repository, issue, {
      'state': 'success',
      'description': 'Code review passed',
      'context': 'code-review/pullreviews'
    });
  } else if (comment.body.includes(':-1:')) {
    return github.create_status_from_issue(repository, issue, {
      'state': 'failure',
      'description': 'Code review failed',
      'context': 'code-review/pullreviews'
    });
  }
}

var github = require('./github');

exports.process_pull_request = function(pull_request) {
  return github.create_status_from_pr(pull_request, {
    'state': 'pending',
    'description': 'Front-end code review pending',
    'context': 'code-review/pullreviews'
  });
}

exports.process_comment = function({ comment, issue, repository }) {
  if (comment.body === ':+1:') {
    return github.create_status_from_issue(repository, issue, {
      'state': 'success',
      'description': 'Front-end code review passed',
      'context': 'code-review/pullreviews'
    });
  } else if (comment.body === ':-1:') {
    return github.create_status_from_issue(repository, issue, {
      'state': 'failure',
      'description': 'Front-end code review failed',
      'context': 'code-review/pullreviews'
    });
  }
}

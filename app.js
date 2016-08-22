var express       = require('express'),
    bodyParser    = require('body-parser'),
    github        = require('octonode'),
    eventHandlers = require('./event_handlers');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/event_handler', function (req, res) {
  switch(req.headers['x-github-event']) {
    case 'pull_request':
      if(req.body.action === 'opened') {
        eventHandlers.process_pull_request(req.body.pull_request);
      }
      break;
    case 'push':
      eventHandlers.process_push(req.body);
      break;
    case 'issue_comment':
      if(req.body.action === 'created') {
        eventHandlers.process_comment(req.body);
      }
      break;
  }
  res.send('ok');
});

app.listen(3000, function() {
  console.log('PullReviews listening on port 3000');
});

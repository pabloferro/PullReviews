var express       = require('express'),
    bodyParser    = require('body-parser'),
    github        = require('octonode'),
    eventHandlers = require('./event_handlers'),

const GITHUB_TOKEN = '3467ce0288eb97fb51463b9b2ecf5595b533f5a6';

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/event_handler', function (req, res) {
  switch(req.headers['x-github-event']) {
    case 'pull_request':
      if(req.body.action === 'opened') {
        return eventHandlers.process_pull_request(req.body.pull_request);
      }
    case 'issue_comment':
      if(req.body.action === 'created') {
        return eventHandlers.process_comment(req.body);
      }
  }
  res.send('It works!');
});

app.listen(3000);

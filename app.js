var express       = require('express'),
    bodyParser    = require('body-parser'),
    eventHandlers = require('./event_handlers'),
    config        = require('./config/config'),
    winston    = require('winston');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res){
    res.send('Pull Reviews');
});

const handleEvent = function(event, body) {
    switch(event) {
    case 'pull_request':
        if(body.action === 'opened') {
            eventHandlers.process_pull_request(body.pull_request);
        }
        break;
    case 'push':
        eventHandlers.process_push(body);
        break;
    case 'issue_comment':
        if(body.action === 'created') {
            eventHandlers.process_comment(body);
        }
        break;
    }
};

app.post('/event_handler', function (req, res) {
    handleEvent(req.headers['x-github-event'], req.body);
    res.send('ok');
});

app.listen(config, function() {
    winston.info(`PullReviews listening on port ${config}`);
});

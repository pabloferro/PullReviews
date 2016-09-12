var eventHandlers = require('../services/event_handlers');

exports.handle_event = function (req, res) {
    switch(req.headers['x-github-event']) {
    case 'pull_request':
        if(req.body.action === 'opened' ||
           req.body.action === 'synchronize') {
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
};

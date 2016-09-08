var Promise        = require('bluebird'),
    express        = require('express'),
    authentication = require('express-authentication'),
    bodyParser     = require('body-parser'),
    eventHandlers  = require('./event_handlers'),
    config         = require('./config/config').config,
    winston        = require('winston'),
    request        = Promise.promisifyAll(require('request')),
    repos          = require('./repos');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function myauth(req, res, next) {
    req.challenge = req.get('Authorization');
    repos.get_user_by_token(req.challenge).then((user) => {
        winston.info(`user: ${user}`);
        if (user) {
            req.authenticated = true;
            req.authentication = user;
        } else {
            req.authenticated = false;
            req.authentication = { error: 'Invalid token' };
        }
    }).catch((error) => {
        winston.error(`Error on get user by token: ${error}`);
    }).finally(() => {
        next();
    });
});

app.get('/', function(req, res){
    res.send(`Pull Reviews<br>
              <a href="https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${config.github.id}">
                  Authorize PullReviews
              </a>`);
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

app.get('/oauth/callback', function(req, res) {
    winston.info(`code: ${req.query.code}`);
    res.send(req.query.code);
});


app.post('/auth/github', function(req, res) {
    winston.info(`code: ${req.body.code}`);
    const options = {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
            'Accept': 'application/json'
        },
        form: {
            client_id: config.github.id,
            client_secret: config.github.secret,
            code: req.body.code
        },
        json: true
    };

    request.postAsync(options).then(function(response) {
        const access_token = response.body.access_token;
        const options = {
            url: 'https://api.github.com/user',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${access_token}`,
                'User-Agent': 'PullReviews'
            },
            json: true
        };
        request.getAsync(options).then(function(response) {
            repos.save_token(response.body.login, access_token);
            res.send({
                user: response.body.login,
                access_token
            });
        });
    }).catch(function(error, response, body) {
        res.send({ error, response, body });
    });
});

app.get('/authenticated', authentication.required(), function (req, res) {
    res.send({ success: true });
});

app.listen(config.port, function() {
    winston.info(`PullReviews listening on port ${config.port}`);
});

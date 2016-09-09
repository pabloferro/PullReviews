var authentication = require('express-authentication'),
    events         = require('./controllers/events'),
    login          = require('./controllers/login'),
    repositories   = require('./controllers/repositories'),
    config         = require('../config/config').config,
    winston        = require('winston');

exports.init = function (app) {
    // Index (these two endpoints won't be necessary with the frontend app)
    app.get('/', function(req, res){
        res.send(`<h1>Pull Reviews</h1>
                  <a href="https://github.com/login/oauth/authorize?scope=user:email,repo&client_id=${config.github.id}">
                    Authorize PullReviews
                  </a>`);
    });
    app.get('/oauth/callback', function(req, res) {
        winston.info(`code: ${req.query.code}`);
        res.send(req.query.code);
    });

    app.post('/event_handler', events.handle_event);
    app.post('/auth/github', login.github);

    app.get('/authenticated', authentication.required(), function (req, res) {
        res.send({ success: true });
    });

    app.get('/repositories', authentication.required(), repositories.index);
    app.post('/repository', authentication.required(), repositories.create);
};

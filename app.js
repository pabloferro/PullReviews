var bodyParser     = require('body-parser'),
    express        = require('express'),
    winston        = require('winston'),
    config         = require('./config/config').config,
    auth           = require('./app/middlewares/auth'),
    routes         = require('./app/routes');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(auth);

routes.init(app);

app.listen(config.port, function() {
    winston.info(`PullReviews listening on port ${config.port}`);
});

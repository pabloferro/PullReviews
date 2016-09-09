var winston = require('winston'),
    repos   = require('../services/repos');

module.exports = function myauth(req, res, next) {
    req.challenge = req.get('Authorization');
    repos.get_user_by_token(req.challenge).then((user) => {
        if (user) {
            req.authenticated = true;
            req.authentication = user;
        } else {
            req.authenticated = false;
            req.authentication = { error: 'Invalid token' };
        }
    }).catch((error) => {
        req.authenticated = false;
        winston.error(`Error on get user by token: ${error}`);
    }).finally(() => {
        next();
    });
};

var nconf      = require('nconf'),
    readConfig = require('read-config'),
    config     = readConfig('./.github.json');

exports.config = {
    common: {
        port: nconf.get('PORT'),
        github: {
            id: config.id,
            secret: config.secret,
        },
    }
};

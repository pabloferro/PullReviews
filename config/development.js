var readConfig = require('read-config'),
    config     = readConfig('./.github.json');

exports.config = {
    common: {
        port: process.env.PORT,
        github: {
            id: config.id,
            secret: config.secret,
        },
    }
};

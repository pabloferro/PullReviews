var readConfig = require('read-config'),
    config     = readConfig('./.github.json');

exports.config = {
    port: process.env.PORT || 3000,
    github: {
        id: config.id,
        secret: config.secret,
    },
};

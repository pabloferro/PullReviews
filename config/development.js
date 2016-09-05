var readConfig = require('read-config'),
    config     = readConfig('./.github.json');

exports.config = {
    port: process.env.PORT || 3000,
    mongoUrl: 'mongodb://localhost:27017/pullreviews',
    github: {
        id: config.id,
        secret: config.secret,
    },
};

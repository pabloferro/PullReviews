var Promise     = require('bluebird'),
    MongoClient = Promise.promisifyAll(require('mongodb').MongoClient),
    assert      = require('assert'),
    config      = require('./config/config').config,
    winston     = require('winston');

var db;

const users_collection = function () {
    return Promise.promisifyAll(db.collection('users'));
};

MongoClient.connectAsync(config.mongoUrl).then((dbObject) => {
    winston.info(`Mongo OK`);
    db = dbObject;
    return db;
}).catch((error) => {
    winston.error(`Mongo Error: ${error}`);
});

exports.save_token = function (user, token) {
    return users_collection().updateOneAsync({ user }, { $set: { token} }, { upsert: true })
        .catch((error) => winston.error(`Mongo Error: ${err}`));
};

exports.get_token = function (user) {
    return users_collection().findOneAsync({ user }).then((user) => user.token);
};

exports.get_user_by_token = function (token) {
    return users_collection().findOneAsync({ token });
};

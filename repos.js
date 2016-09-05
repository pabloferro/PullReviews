var Promise     = require('bluebird'),
    MongoClient = Promise.promisifyAll(require('mongodb').MongoClient),
    assert      = require('assert'),
    config      = require('./config/config').config,
    winston     = require('winston');

var db;

MongoClient.connectAsync(config.mongoUrl).then((dbObject) => {
    winston.info(`Mongo OK`);
    db = dbObject;
    return db;
}).catch((error) => {
    winston.error(`Mongo Error: ${error}`);
});

exports.save_token = function (user, token) {
    var tokens_collection = Promise.promisifyAll(db.collection('tokens'));
    return tokens_collection.updateOneAsync({ user }, { $set: { token} }, { upsert: true })
        .catch((error) => winston.error(`Mongo Error: ${err}`));
};

exports.get_token = function (user) {
    var tokens_collection = Promise.promisifyAll(db.collection('tokens'));
    return tokens_collection.findOneAsync({ user }).then((user) => user.token);
};

var Promise     = require('bluebird'),
    MongoClient = Promise.promisifyAll(require('mongodb').MongoClient),
    assert      = require('assert'),
    config      = require('../../config/config').config,
    winston     = require('winston');

var db;

const users_collection = function () {
    return Promise.promisifyAll(db.collection('users'));
};

MongoClient.connectAsync(config.mongoUrl).then((dbObject) => {
    db = dbObject;
    return db;
}).catch((error) => {
    winston.error(`Mongo Error: ${error}`);
});

exports.save_token = function (user, token) {
    return users_collection().updateOneAsync({ user }, { $set: { token } }, { upsert: true })
        .catch((error) => winston.error(`Mongo Error: ${err}`));
};

exports.save_repos = function (user, repos) {
    return users_collection().updateOneAsync({ user }, { $set: { repos } })
        .catch((error) => winston.error(`Mongo Error: ${err}`));
};

exports.find_user = function (query) {
    return users_collection().findOneAsync(query);
};

const repo_exists = function (repos, repo_full_name) {
    return repos.some((repo) => repo.toLowerCase() === repo_full_name.toLowerCase());
};

exports.add_repo_to_user = function (user_name, repo_full_name) {
    module.exports.find_user({ user: user_name }).then((user) => {
        if(!user.repos || !repo_exists(user.repos, repo_full_name)) {
            user.repos = user.repos || [];
            user.repos.push(repo_full_name);
            module.exports.save_repos(user_name, user.repos);
        }
    }).catch((error) => {
        winston.error(error);
    });
};

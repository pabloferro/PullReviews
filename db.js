exports.db = {};

MongoClient.connectAsync(config.mongoUrl).then((dbObject) => {
    winston.info(`Mongo OK`);
    exports.db = dbObject;
    return exports.db;
}).catch((error) => {
    winston.error(`Mongo Error: ${error}`);
});

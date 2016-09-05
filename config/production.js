exports.config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    github: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET
    }
};

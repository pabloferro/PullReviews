exports.config = {
    common: {
        port: process.env.PORT,
        github: {
            id: process.env.GITHUB_CLIENT_ID,
            secret: process.env.GITHUB_CLIENT_SECRET,
        },
    }
};

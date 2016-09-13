var chai     = require('chai'),
    expect   = chai.expect,
    app      = require('../../app'),
    chaiHttp = require('chai-http'),
    nock     = require('nock');

chai.use(chaiHttp);

describe('login', function () {
    describe('GET /auth/github', function () {
        it('should return the user with name and access token', function (done) {
            nock('https://github.com')
                .post('/login/oauth/access_token')
                .reply(200, { access_token: 'access_token' });

            nock('https://api.github.com')
                .get('/user')
                .reply(200, { login: 'username' });

            chai.request(app)
                .post('/auth/github')
                .send({ code: '123' })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.access_token).to.equal('access_token');
                    expect(res.body.user).to.equal('username');
                    done();
                });
        });
    });
});

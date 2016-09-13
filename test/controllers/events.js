var chai     = require('chai'),
    expect   = chai.expect,
    simple   = require('simple-mock'),
    app      = require('../../app'),
    Promise  = require('bluebird'),
    chaiHttp = require('chai-http'),
    github   = require('../../app/services/github');

chai.use(chaiHttp);

const github_pull_request_event = function (action) {
    return chai.request(app)
        .post('/event_handler')
        .set('x-github-event', 'pull_request')
        .send({
            action,
            'pull_request': {
                'head': { 'sha': '123' },
                'base': { 'repo': { 'full_name': 'test/repo' } }
            }
        });
};

const github_issue_comment_event = function (comment) {
    return chai.request(app)
        .post('/event_handler')
        .set('x-github-event', 'issue_comment')
        .send({
            'action': 'created',
            'issue': { 'number': 2 },
            'comment': { 'body': comment },
            'repository': { 'full_name': 'test/repo' },
            'sender': {
                'login': 'someone',
                'id': 1,
                'type': 'User',
                'site_admin': false
            }
        });
};

describe('events', function () {
    describe('POST /event_handler', function () {
        var statusList = [];

        beforeEach(function() {
            statusList = [];
            simple.mock(github, 'get_config_file').returnWith(Promise.resolve({ reviewersRequired: 1 }));
            simple.mock(github, 'create_status').callFn((repo_full_name, pull_request_sha, status) => {
                statusList.push({ repo_full_name, pull_request_sha, status });
            });
            simple.mock(github, 'create_status_from_issue').callFn((repo_full_name, issue, status) => {
                statusList.push({ repo_full_name, issue, status });
            });
        });

        describe('pull_request opened', function () {
            it('should create a pending status', function (done) {
                github_pull_request_event('opened')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(statusList.length).to.equal(1);
                        expect(statusList[0].status.state).to.equal('pending');
                        done();
                    });
            });
        });

        describe('pull_request synchronize', function () {
            it('should create a pending status', function (done) {
                github_pull_request_event('synchronize')
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(statusList.length).to.equal(1);
                        expect(statusList[0].status.state).to.equal('pending');
                        done();
                    });
            });
        });

        describe('push', function () {
            it('should create a pending status', function (done) {
                chai.request(app)
                    .post('/event_handler')
                    .set('x-github-event', 'push')
                    .send({
                        'after': '123',
                        'repository': { 'full_name': 'test/repo' }
                    })
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(statusList.length).to.equal(1);
                        expect(statusList[0].status.state).to.equal('pending');
                        done();
                    });
            });
        });

        describe('issue_comment created', function () {
            describe('approval comment', function () {
                it('should create a success status', function (done) {
                    github_issue_comment_event('Looks good :+1:')
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(statusList.length).to.equal(1);
                            expect(statusList[0].status.state).to.equal('success');
                            done();
                        });
                });
            });

            describe('disapproval comment', function () {
                it('should create a success status', function (done) {
                    github_issue_comment_event('Fixes pending :-1:')
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(statusList.length).to.equal(1);
                            expect(statusList[0].status.state).to.equal('failure');
                            done();
                        });
                });
            });
        });
    });
});

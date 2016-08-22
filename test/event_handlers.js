var expect        = require('chai').expect,
    simple        = require('simple-mock'),
    eventHandlers = require('../event_handlers'),
    github        = require('../github');

describe('eventHandlers', function() {

  afterEach(function() {
    simple.restore();
  });

  describe('#process_pull_request()', function() {
    it('should call create_status_from_pr', function() {
      simple.mock(github, 'create_status_from_pr').returnWith(null);
      eventHandlers.process_pull_request();
      expect(github.create_status_from_pr.callCount).to.equal(1);
    });
  });

  describe('#process_push()', function() {
    it('should call create_status', function() {
      simple.mock(github, 'create_status').returnWith(null);
      eventHandlers.process_push({ head: 'sha', repository: {} });
      expect(github.create_status.callCount).to.equal(1);
    });
  });

  describe('#process_comment()', function() {
    beforeEach(function() {
      simple.mock(github, 'create_status_from_issue').returnWith(null);
    });

    describe('when it is an approval comment', function() {
      it('should call create_status_from_issue', function() {
        eventHandlers.process_comment({ comment: { body: ':+1:' } });
        expect(github.create_status_from_issue.callCount).to.equal(1);
      });
    });
    describe('when it is a disapproval comment', function() {
      it('should call create_status_from_issue', function() {
        eventHandlers.process_comment({ comment: { body: ':-1:' } });
        expect(github.create_status_from_issue.callCount).to.equal(1);
      });
    });
    describe('when it is an unrelated message', function() {
      it('should not call create_status_from_issue', function() {
        eventHandlers.process_comment({
          comment: { body: 'upload screenshots' },
          issue: {},
          repository: {}
        });
        expect(github.create_status_from_issue.callCount).to.equal(0);
      });
    });
  });
});

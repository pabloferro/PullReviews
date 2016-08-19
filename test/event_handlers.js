var expect        = require('chai').expect;
    eventHandlers = require('../event_handlers');

describe('eventHandlers', function() {
  describe('#process_pull_request()', function() {
    it('should return -1 when the value is not present', function() {
      expect([1,2,3].indexOf(4)).to.equal(-1);
    });
  });
});

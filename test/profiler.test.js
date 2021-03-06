var assert = require('assert');
var sinon = require('sinon');

var Profiler = require('../lib/profiler');

describe('Profiler', function() {
  var profiler, agent;
  beforeEach(function() {
    agent = {
      metrics: {
        histogram: sinon.spy()
      },
      logger: {
        info: sinon.spy()
      }
    };
    profiler = new Profiler(agent, { name: 'test' }, { HUNT_MEMORY_LEAKS: true });
    // avoid having to create workers
    process.send = function() {};
  });

  afterEach(function() {
    process.send = undefined;
  });

  describe('#createThrottledSnapshot', function() {
    it('should create a snapshot and log', function(done) {
      this.timeout(3000);
      profiler.createThrottledSnapshot('testing');
      setTimeout(() => {
        assert(agent.logger.info.calledOnce);
        done();
      }, 1000);
    });
  });

  describe('#createProfile', function() {
    it('should create a profile', function(done) {
      this.timeout(3000);
      profiler.createProfile(1000, function(err, path) {
        assert.ifError(err);
        assert(path);
        done();
      });
    });
  });
});

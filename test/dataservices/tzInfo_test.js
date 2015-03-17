/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var tzInfoMaker = require('../../src/dataservices/tzInfo');

// because jshint doesn't like .to.be.null
/* jshint expr: true */

describe('tzInfoMaker', function() {
  it('exports a function', function() {
    assert.isFunction(tzInfoMaker);
  });

  it('makes a function', function() {
    assert.isFunction(tzInfoMaker([]));
  });

  it('...which returns `null` by default', function() {
    var tzInfo = tzInfoMaker([]);
    expect(tzInfo(new Date().toISOString())).to.be.null;
  });

  describe('tzInfo', function() {
    var s = new Date(2015, 0, 1, 0, 0, 0).toISOString();
    var m = new Date(2015, 1, 1, 0, 0, 0).toISOString();
    var e = new Date(2015, 2, 1, 0, 0, 0).toISOString();
    var tzInfo = tzInfoMaker([{
      start: s,
      end: m,
      timezone: 'Pacific/Honolulu'
    }, {
      start: m,
      end: e,
      timezone: 'America/Adak'
    }]);

    it('returns the timezone of the interval containing the given datetime', function() {
      expect(tzInfo(new Date(2015, 0, 15, 12, 30, 5).toISOString())).to.equal('Pacific/Honolulu');
    });

    it('returns `null` if no interval in the data contains the given datetime', function() {
      expect(tzInfo(new Date(2015, 5, 15, 12, 30, 5).toISOString())).to.be.null;
    });
  });
});
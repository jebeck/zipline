/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var bg = require('../../util/bg');

describe('bg data utility', function() {
  it('exports an object', function() {
    assert.isObject(bg);
  });

  describe('convertMgdlToMmol', function() {
    it('is a function', function() {
      assert.isFunction(bg.convertMgdlToMmol);
    });

    it('converts blood glucose in mg/dL to mmol/L floating point, no rounding', function() {
      expect(bg.convertMgdlToMmol(100)).to.equal(5.550747991045533);
    });
  });

  describe('convertMmolToMgdl', function() {
    it('is a function', function() {
      assert.isFunction(bg.convertMmolToMgdl);
    });

    it('converts blood glucose in mmol/L to a rounded value in mg/dL', function() {
      expect(bg.convertMmolToMgdl(5.550747991045533)).to.equal(100);
    });
  });
});
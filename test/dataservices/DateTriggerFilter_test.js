var _ = require('lodash');
var d3 = require('d3');

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var DateTriggerFilter = require('../../src/dataservices/DateTriggerFilter');

describe('DateTriggerFilter', function() {
  it('exports a function', function() {
    assert.isFunction(DateTriggerFilter);
  });

  it('makes an object', function() {
    assert.isObject(DateTriggerFilter([]));
  });

  it('filters within bounds for point-in-time data', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
    expect(thisFilter.filter([now, d3.time.day.utc.offset(now, 1)])).to.deep.equal([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)}
    ]);
  });

  it('caches results when filter center is within twenty-four hours', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
    thisFilter.filter([now, d3.time.day.utc.offset(now, 1)]);
    expect(thisFilter.filter([d3.time.hour.utc.offset(now, 8), d3.time.hour.utc.offset(now, 32)])).to.deep.equal([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)}
    ]);
  });

  it('can be forced to re-filter (rather than return cache)', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
    thisFilter.filter([now, d3.time.day.utc.offset(now, 1)]);
    expect(thisFilter.filter([d3.time.hour.utc.offset(now, 8), d3.time.hour.utc.offset(now, 32)], true)).to.deep.equal([
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
  });

  it('filters for intersection with bounds for interval data, wide interval', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, -20),
        end: d3.time.hour.utc.offset(now, 20)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([
      {
        start: d3.time.hour.utc.offset(now, -20),
        end: d3.time.hour.utc.offset(now, 20)
      }
    ]);
  });

  it('filters for intersection with bounds for interval data, narrow interval', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, 2),
        end: d3.time.hour.utc.offset(now, 4)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([
      {
        start: d3.time.hour.utc.offset(now, 2),
        end: d3.time.hour.utc.offset(now, 4)
      }
    ]);
  });

  it('filters for intersection with bounds inclusively, left edge', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 4)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 4)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 2)], true)).to.deep.equal([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 4)
      }
    ]);
  });

  it('filters for intersection with bounds inclusively, right edge', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, 2),
        end: d3.time.hour.utc.offset(now, 10)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([
      {
        start: d3.time.hour.utc.offset(now, 2),
        end: d3.time.hour.utc.offset(now, 10)
      }
    ]);
    expect(thisFilter.filter([d3.time.hour.utc.offset(now, 8), d3.time.hour.utc.offset(now, 10)], true)).to.deep.equal([
      {
        start: d3.time.hour.utc.offset(now, 2),
        end: d3.time.hour.utc.offset(now, 10)
      }
    ]);
  });

  it('filters for intersection with bounds inclusively, both edges', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 10)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 10)
      }
    ]);
  });

  it('filters out intervals entirely to the left', function() {
    var now =  new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, -20),
        end: d3.time.hour.utc.offset(now, -10)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([]);
  });

  it('filters out intervals entirely to the right', function() {
    var now =  new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, 20),
        end: d3.time.hour.utc.offset(now, 30)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 10)])).to.deep.equal([]);
  });

  it('returns results in ascending order, point-in-time', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {time: d3.time.hour.utc.offset(now, 5)},
      {time: d3.time.hour.utc.offset(now, 4)},
      {time: d3.time.hour.utc.offset(now, 1)},
      {time: d3.time.hour.utc.offset(now, 2)},
      {time: d3.time.hour.utc.offset(now, 3)}
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 4)])).to.deep.equal([
      {time: d3.time.hour.utc.offset(now, 1)},
      {time: d3.time.hour.utc.offset(now, 2)},
      {time: d3.time.hour.utc.offset(now, 3)},
      {time: d3.time.hour.utc.offset(now, 4)}
    ]);
  });

  it('returns results in ascending order, interval', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {
        start: d3.time.hour.utc.offset(now, 4),
        end: d3.time.hour.utc.offset(now, 6)
      },
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 4)
      },
      {
        start: d3.time.hour.utc.offset(now, 6),
        end: d3.time.hour.utc.offset(now, 9)
      }
    ]);
    expect(thisFilter.filter([now, d3.time.hour.utc.offset(now, 8)])).to.deep.equal([
      {
        start: now,
        end: d3.time.hour.utc.offset(now, 4)
      },
      {
        start: d3.time.hour.utc.offset(now, 4),
        end: d3.time.hour.utc.offset(now, 6)
      },
      {
        start: d3.time.hour.utc.offset(now, 6),
        end: d3.time.hour.utc.offset(now, 9)
      }
    ]);
  });

  it('yields the last data point by request', function() {
    var now = new Date();
    var thisFilter = new DateTriggerFilter([
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
    expect(thisFilter.getLast()).to.deep.equal([
      {time: d3.time.hour.utc.offset(now, 25)}
    ]);
  });

  it('yields all data on request', function() {
    var now = new Date();
    var thisData = [
      {time: d3.time.hour.utc.offset(now, 6)},
      {time: d3.time.hour.utc.offset(now, 12)},
      {time: d3.time.hour.utc.offset(now, 15)},
      {time: d3.time.hour.utc.offset(now, 18)},
      {time: d3.time.hour.utc.offset(now, 25)}
    ];
    var thisFilter = new DateTriggerFilter(thisData);
    expect(thisFilter.all()).to.deep.equal(_.sortBy(thisData, function(d) { return d.time; }));
  });
});
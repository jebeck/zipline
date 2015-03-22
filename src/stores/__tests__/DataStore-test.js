jest.dontMock('immutable');
var Immutable = require('immutable');
jest.dontMock('object-assign');

jest.dontMock('../DataStore');

jest.dontMock('../../constants/ZipConstants');
jest.dontMock('../../dataservices/DateTriggerFilter');

var d3 = require('d3');

describe('DataStore', function() {
  var ZipConstants = require('../../constants/ZipConstants');
  var ZipDispatcher, DataStore, tzInfoMaker, callback;

  var beginningOfYear = d3.time.year.utc.floor(new Date());
  var bounds = [beginningOfYear, d3.time.day.utc.offset(beginningOfYear, 1)];
  var bigBounds = [
    d3.time.day.utc.offset(beginningOfYear, -1),
    d3.time.day.utc.offset(beginningOfYear, 2)
  ];
  var aprilFools = '2015-04-01T00:00:00.000Z';

  var data = [
    {
      type: 'offsetInterval',
      time: beginningOfYear.toISOString()
    },
    {
      type: 'foo',
      value: 5,
      time: d3.time.hour.utc.offset(beginningOfYear, 5).toISOString()
    },
    {
      type: 'foo',
      value: 2,
      time: d3.time.hour.utc.offset(beginningOfYear, 25).toISOString()
    },
    {
      type: 'bar',
      value: 42,
      time: d3.time.hour.utc.offset(beginningOfYear, 3).toISOString()
    }
  ];

  var payloadInitData = {
    action: {
      actionType: ZipConstants.INIT_DATA,
      allData: data,
      plotTypes: ['foo', 'bar']
    }
  };

  var payloadFilterData = {
    action: {
      actionType: ZipConstants.FILTER_DATA,
      bounds: bounds
    }
  };

  var payloadBigFilterData = {
    action: {
      actionType: ZipConstants.FILTER_DATA,
      bounds: bigBounds
    }
  };

  var payloadFocusData = {
    action: {
      actionType: ZipConstants.FOCUS_DATA,
      data: [42]
    }
  };

  beforeEach(function() {
    ZipDispatcher = require('../../dispatcher/ZipDispatcher');
    DataStore = require('../DataStore');
    tzInfoMaker = require('../../dataservices/tzInfo');
    tzInfoMaker.mockReturnValueOnce(function() { return 'UTC'; });
    callback = ZipDispatcher.register.mock.calls[0][0];
  });

  it('exists', function() {
    expect(DataStore).toBeDefined();
  });

  it('registers a callback with the dispatcher', function() {
    expect(ZipDispatcher.register.mock.calls.length).toBe(1);
  });

  it('returns an empty array for buffer bounds before initialization', function() {
    var buffer = DataStore.getBufferBounds();
    expect(buffer).toEqual([]);
  });

  it('returns null for center before initialization', function() {
    var center = DataStore.getCenter();
    expect(center).toBe(null);
  });

  it('returns an empty object for current data before initialization', function() {
    var current = DataStore.getCurrentData();
    expect(current).toEqual({});
  });

  it('returns an empty object for data services before initialization', function() {
    var services = DataStore.getDataServices();
    expect(services).toEqual({});
  });

  it('returns an empty array for focused data before initialization', function() {
    var focus = DataStore.getFocusedData();
    expect(Array.isArray(focus)).toBe(true);
    expect(focus.length).toBe(0);
  });

  it('returns a timespan object with null values before initialization', function() {
    var timespan = DataStore.getTimespan();
    expect(timespan).toEqual({
      single: null,
      total: null
    });
  });

  it('returns an empty array for initial view bounds before initialization', function() {
    var initial = DataStore.getInitialViewBounds();
    expect(initial).toEqual([]);
  });

  it('returns an empty array for view bounds before initialization', function() {
    var view = DataStore.getViewBounds();
    expect(view).toEqual({});
  });

  it('stores an initial data array and sets the timespan accordingly', function() {
    var prefilter = {dataWithBuffer: [], dataInView: []};
    callback(payloadInitData);
    expect(DataStore.getCurrentData()).toEqual({
      foo: prefilter,
      bar: prefilter,
      offsetInterval: prefilter
    });
    expect(DataStore.getTimespan()).toEqual({
      single: [
        beginningOfYear.valueOf(),
        d3.time.hour.utc.offset(beginningOfYear, 24).valueOf()
      ],
      total: [
        beginningOfYear.valueOf(),
        d3.time.year.utc.offset(beginningOfYear, 1).valueOf() - 1
      ]
    });
  });

  it('stores an initial data array and sets up data services accordingly', function() {
    callback(payloadInitData);
    var services = DataStore.getDataServices();
    for (var key in services) {
      expect(services[key]).toEqual(jasmine.any(Object));
    }
  });

  it('stores an initial data array and sets up initial view bounds accordingly', function() {
    callback(payloadInitData);
    var initial = DataStore.getInitialViewBounds();
    var left = d3.time.hour.utc.offset(beginningOfYear, 1);
    expect(initial).toEqual([
      left,
      d3.time.hour.utc.offset(left, 24)
    ]);
  });

  it('filters data given bounds and sets the buffer and view bounds accordingly', function() {
    callback(payloadInitData);
    callback(payloadFilterData);
    expect(DataStore.getBufferBounds()).toEqual([
      bounds[0],
      bounds[1]
    ]);
    expect(DataStore.getCenter()).toEqual(d3.time.hour.utc.offset(beginningOfYear, 12).valueOf());
    var currData = DataStore.getCurrentData();
    expect(Immutable.is(currData.foo.dataWithBuffer, Immutable.List([data[1]])));
    expect(Immutable.is(currData.foo.dataInView, Immutable.List([data[1]])));
    expect(Immutable.is(currData.bar.dataWithBuffer, Immutable.List([data[3]])));
    expect(Immutable.is(currData.bar.dataInView, Immutable.List([data[3]])));
    expect(Immutable.is(currData.offsetInterval.dataWithBuffer, Immutable.List([data[0]])));
    expect(Immutable.is(currData.offsetInterval.dataInView, Immutable.List([data[0]])));
    expect(DataStore.getViewBounds()).toEqual({
      leftEdge: {
        datetime: bounds[0],
        timezone: 'UTC'
      },
      rightEdge: {
        datetime: bounds[1],
        timezone: 'UTC'
      }
    });
  });

  it('filters data given BIGGER bounds and sets the buffer and view bounds accordingly', function() {
    callback(payloadInitData);
    callback(payloadBigFilterData);
    expect(DataStore.getBufferBounds()).toEqual([
      bigBounds[0],
      bigBounds[1]
    ]);
    expect(DataStore.getCenter()).toEqual(d3.time.hour.utc.offset(beginningOfYear, 12).valueOf());
    var currData = DataStore.getCurrentData();
    expect(Immutable.is(currData.foo.dataWithBuffer, Immutable.List([data[1], data[2]])));
    expect(Immutable.is(currData.foo.dataInView, Immutable.List([data[1]])));
    expect(Immutable.is(currData.bar.dataWithBuffer, Immutable.List([data[3]])));
    expect(Immutable.is(currData.bar.dataInView, Immutable.List([data[3]])));
    expect(Immutable.is(currData.offsetInterval.dataWithBuffer, Immutable.List([data[0]])));
    expect(Immutable.is(currData.offsetInterval.dataInView, Immutable.List([data[0]])));
    expect(DataStore.getViewBounds()).toEqual({
      leftEdge: {
        datetime: bounds[0],
        timezone: 'UTC'
      },
      rightEdge: {
        datetime: bounds[1],
        timezone: 'UTC'
      }
    });
  });

  it('sets focused data', function() {
    callback(payloadFocusData);
    expect(DataStore.getFocusedData()).toEqual([42]);
  });
});
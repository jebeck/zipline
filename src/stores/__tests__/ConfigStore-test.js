jest.dontMock('../../constants/ZipConstants');
jest.dontMock('../ConfigStore');
jest.dontMock('object-assign');

var _ = require('lodash');
var d3 = require('d3');
var Immutable = require('immutable');

describe('ConfigStore', function() {
  var ZipConstants = require('../../constants/ZipConstants');
  var ZipDispatcher, ConfigStore, callback;

  var beginningOfYear = d3.time.year.utc.floor(new Date());
  var bounds = [beginningOfYear, d3.time.day.utc.offset(beginningOfYear, 1)];

  var config = {
    slices: [{
      id: 'Foo',
      dataFn: function(bounds) { return [2,4,6,8]; },
      plots: [{
        id: 'Bar',
        type: 'type'
      }, {
        id: 'Spam',
        data: [1,3,5]
      }]
    }]
  };

  var time = {
    span: {
      single: [1,10],
      total: [1,1000]
    },
    location: {
      buffer: {
        leftEdge: 1,
        rightEdge: 30
      },
      view: {
        leftEdge: 1,
        rightEdge: 10
      }
    }
  };

  var payloadInitConfig = {
    action: {
      actionType: ZipConstants.INIT_CONFIG,
      baseConfig: config 
    }
  };

  var payloadFilterData = {
    action: {
      actionType: ZipConstants.FILTER_DATA,
      bounds: bounds
    }
  };

  beforeEach(function() {
    ZipDispatcher = require('../../dispatcher/ZipDispatcher');
    ConfigStore = require('../ConfigStore');
    DataStore = require('../DataStore');
    DataStore.getCurrentData.mockReturnValue({
      type: {
        dataWithBuffer: Immutable.List([1,2,3,4,5]),
        dataInView: Immutable.List([2,3,4])
      }
    });
    DataStore.getTimespan.mockReturnValue(time.span);
    callback = ZipDispatcher.register.mock.calls[0][0];
  });

  it('exists', function() {
    expect(ConfigStore).toBeDefined();
  });

  it('registers a callback with the dispatcher', function() {
    expect(ZipDispatcher.register.mock.calls.length).toBe(1);
  });

  it('returns null for createConfig before initialization', function() {
    expect(ConfigStore.getCreateConfig()).toBe(null);
  });

  it('returns null for drawConfig before initialization', function() {
    expect(ConfigStore.getDrawConfig()).toBe(null);
  });

  it('returns null for drawConfig before initialization', function() {
    expect(ConfigStore.getDrawConfig()).toBe(null);
  });

  it('returns null for dataBySlice before initialization', function() {
    expect(ConfigStore.getDataBySlice()).toBe(null);
  });

  it('stores an initial config', function() {
    callback(payloadInitConfig);
    expect(Immutable.is(ConfigStore.getCreateConfig(), Immutable.fromJS({timespan: time.span}))).toBe(true);
    expect(Immutable.is(ConfigStore.getDrawConfig(), Immutable.fromJS(config.slices))).toBe(true);
    expect(Immutable.is(ConfigStore.getDataBySlice(), Immutable.fromJS({
      'Foo': null,
      'Bar': null,
      'Spam': null
    }))).toBe(true);
  });

  it('updates dataBySlice upon filtering of data', function() {
    callback(payloadInitConfig);
    callback(payloadFilterData);
    expect(Immutable.is(ConfigStore.getDataBySlice(), Immutable.Map({
      'Foo': Immutable.List([2,4,6,8]),
      'Bar': Immutable.List([1,2,3,4,5]),
      'Spam': Immutable.List([1,3,5])
    }))).toBe(true);
  });
});
/* jshint eqnull: true */

var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');

var DataStore = require('./DataStore');
var ZipConstants = require('../constants/ZipConstants');
var ZipDispatcher = require('../dispatcher/ZipDispatcher');

var localTimeIntervalsMaker = require('../dataservices/localTimeIntervals');

var debug = _.noop;
if (typeof window !== 'undefined' && (!window.process || window.process.title !== '/usr/local/bin/node')) {
  debug = require('bows')('ConfigStore');
}

var CHANGE_EVENT = 'change';

var _createConfig = null;
var _drawConfig = null;

var _dataBySlice = null;

function initializeConfig(config, dataByType, dataServices, timespan) {
  var createOpts = config.opts || {};
  _.assign(createOpts, {timespan: timespan});
  _createConfig = Immutable.fromJS(createOpts);

  var slices = config.slices || [];

  var bySlice = {};
  slices.forEach(function(slice) {
    bySlice[slice.id] = null;
    if (!_.isEmpty(slice.backgroundData)) {
      slice.dataFn = localTimeIntervalsMaker(dataServices[slice.backgroundData], {step: 3});
    }
    var plots = slice.plots;
    plots.forEach(function(plot) {
      bySlice[plot.id] = null;
    });
  });
  _drawConfig = Immutable.fromJS(slices);
  _dataBySlice = Immutable.fromJS(bySlice);
}

function _updateData(currentObj, dataByType, bounds) {
  if (currentObj.has('dataFn')) {
    _dataBySlice = _dataBySlice.set(
      currentObj.get('id'),
      Immutable.fromJS(currentObj.get('dataFn')(bounds))
    );
  }
  else if (currentObj.has('type')) {
    var type = currentObj.get('type');
    var typeData = dataByType[type] ?
      dataByType[type].dataWithBuffer : [];
    _dataBySlice = _dataBySlice.set(
      currentObj.get('id'),
      Immutable.fromJS(typeData)
    );
  }
  else if (currentObj.has('data')) {
    _dataBySlice = _dataBySlice.set(
      currentObj.get('id'),
      Immutable.fromJS(currentObj.get('data'))
    );
  }
  else {
    if (!currentObj.has('data')) {
      console.log(currentObj.toJS());
      throw new Error('If config object does not have `dataFn` or `type`, it must have `data`!');
    }
  }
}

function updateConfigData(dataByType, bounds) {
  var slices = _drawConfig;
  slices.forEach(function(slice) {
    _updateData(slice, dataByType, bounds);
    var plots = slice.get('plots');
    plots.forEach(function(plot) { _updateData(plot, dataByType, bounds); });
  });
}

var ConfigStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  getCreateConfig: function() {
    return _createConfig;
  },
  getDrawConfig: function() {
    return _drawConfig;
  },
  getDataBySlice: function() {
    return _dataBySlice;
  }
});

ConfigStore.dispatchToken = ZipDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ZipConstants.FILTER_DATA:
      ZipDispatcher.waitFor([DataStore.dispatchToken]);
      var bounds = action.bounds;
      updateConfigData(DataStore.getCurrentData(), bounds);
      break;
    case ZipConstants.INIT_CONFIG:
      ZipDispatcher.waitFor([DataStore.dispatchToken]);
      var config = action.baseConfig;
      initializeConfig(config, DataStore.getCurrentData(), DataStore.getDataServices(), DataStore.getTimespan());
      debug('INIT_CONFIG: _createConfig', _createConfig.toJS());
      debug('INIT_CONFIG: _drawConfig', _drawConfig.toJS());
      break;
    default:
      return true;
  }

  ConfigStore.emitChange();
  return true;
});

module.exports = ConfigStore;
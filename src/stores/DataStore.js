var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var moment = require('moment-timezone');
var util = require('util');

var Filter = require('../dataservices/DateTriggerFilter');
var tzInfoMaker = require('../dataservices/tzInfo');

var ZipConstants = require('../constants/ZipConstants');
var ZipDispatcher = require('../dispatcher/ZipDispatcher');

var CHANGE_EVENT = 'change';
var MS_IN_24HRS = 864e5;

var _data = [], grouped;

var _dataState = {
  focused: [],
  time: {
    location: {
      buffer: {
        leftEdge: null,
        rightEdge: null
      },
      initial: {
        leftEdge: null,
        rightEdge: null
      },
      view: {
        leftEdge: null,
        rightEdge: null
      }
    },
    span: {
      single: null,
      total: null
    }
  }
};

var _dataTypes = [];

var _dataServices = {};

var _dataByType = {};

var _tzInfo = null;

function initializeData(data, plotTypes) {
  _data = data;
  grouped = _.groupBy(_data, function(d) { return d.type; });
  _dataTypes = Object.keys(grouped);
  _initializeFilters();
  _initializeTimespan();
  _determineInitialViewBounds(plotTypes);
}

function _initializeFilters() {
  for (var i = 0; i < _dataTypes.length; ++i) {
    var type = _dataTypes[i];
    _dataServices[type] = new Filter(grouped[type]);
    _dataByType[type] = {dataWithBuffer: [], dataInView: []};
  }
}

function _initializeTimespan() {
  // ensure sort
  _data = _.sortBy(_data, function(d) {
    return Date.parse(d.time);
  });
  _tzInfo = tzInfoMaker(_.where(_data, {type: 'offsetInterval'}));
  var first = _data[0], last = _data[_data.length - 1];
  if (first.type !== 'offsetInterval') {
    throw new Error(util.format('Expected type `offsetInterval` for first data point, got %s', first.type));
  }
  // assumption here is that firstDate is the startOf the year for its timezone
  var firstDate = new Date(first.time), lastDate = new Date(last.time);
  _dataState.time.span = {
    single: [
      firstDate.valueOf(),
      moment(firstDate).add(24, 'hours').toDate().valueOf()
    ],
    total: [
      firstDate.valueOf(),
      moment(lastDate).tz(_tzInfo(last.time)).endOf('year').toDate().valueOf()
    ]
  };
}

function _determineInitialViewBounds(plotTypes) {
  var lasts = _.sortBy(
    _.filter(_.map(plotTypes, function(type) {
      return _dataServices[type] ? _dataServices[type].getLast()[0] : null;
    }), function(item) { return item !== null; }),
    function(d) { return d.time; }
  );
  var last = lasts[lasts.length - 1];
  _dataState.time.location.initial = {
    leftEdge: moment(Date.parse(last.time)).subtract(24, 'hours').toDate(),
    rightEdge: new Date(last.time)
  };
}

function filterData(bounds) {
  var diff = bounds[1] - bounds[0];
  var viewLeft, viewRight;
  if (diff < 0) {
    throw new Error('Bounds not in greater, lesser order!');
  }
  else if (diff > MS_IN_24HRS) {
    var pad = (diff - MS_IN_24HRS)/2;
    viewLeft = bounds[0].valueOf() + pad;
    viewRight = bounds[1].valueOf() - pad;
  }
  else if (diff <= MS_IN_24HRS) {
    viewLeft = bounds[0].valueOf();
    viewRight = bounds[1].valueOf();
  }
  else {
    throw new Error('Unworkable difference between bounds: ' + diff);
  }
  _setViewBounds(viewLeft, viewRight);
  for (var i = 0; i < _dataTypes.length; ++i) {
    var type = _dataTypes[i];
    _dataByType[type].dataWithBuffer = Immutable.List(_dataServices[type].filter(bounds));
    _dataByType[type].dataInView = Immutable.List(_dataServices[type].filter([viewLeft, viewRight], true));
  }
  _dataState.time.location.buffer = {
    leftEdge: bounds[0],
    rightEdge: bounds[1]
  };
}

function _setViewBounds(left, right) {
  if (left !== undefined && right !== undefined) {
    _dataState.time.location.view = {
      leftEdge: new Date(left),
      rightEdge: new Date(right)
    };
  }
  else {
    throw new Error('View bounds undefined! :(');
  }
}

function focusData(focusedData) {
  _dataState.focused = focusedData;
}

function setCenter(center) {
  _dataState.time.location.view.center = center;
}

var DataStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  getBufferBounds: function() {
    var buffer = _dataState.time.location.buffer;
    if (buffer.leftEdge !== null && buffer.rightEdge !== null) {
      return [
        buffer.leftEdge,
        buffer.rightEdge
      ];
    }
    else {
      return [];
    }
  },
  getCenter: function() {
    var view = _dataState.time.location.view;
    if (view.leftEdge !== null && view.rightEdge !== null) {
      return (Date.parse(view.leftEdge) + Date.parse(view.rightEdge))/2;
    }
    else {
      return null;
    }
  },
  getCurrentData: function() {
    return _dataByType;
  },
  getDataServices: function() {
    return _dataServices;
  },
  getFocusedData: function() {
    return _dataState.focused;
  },
  getInitialViewBounds: function() {
    var initial = _dataState.time.location.initial;
    if (initial.leftEdge !== null && initial.rightEdge !== null) {
      return [
        initial.leftEdge,
        initial.rightEdge
      ];
    }
    else {
      return [];
    }
  },
  getTimespan: function() {
    return _dataState.time.span;
  },
  getViewBounds: function() {
    var view = _dataState.time.location.view;
    if (view.leftEdge !== null && view.rightEdge !== null) {
      return {
        leftEdge: {
          datetime: view.leftEdge,
          timezone: _tzInfo(view.leftEdge)
        },
        rightEdge: {
          datetime: view.rightEdge,
          timezone: _tzInfo(view.rightEdge)
        }
      };
    }
    else {
      return {};
    }
  }
});

DataStore.dispatchToken = ZipDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ZipConstants.FILTER_DATA:
      var bounds = action.bounds;
      filterData(bounds);
      break;
    case ZipConstants.FOCUS_DATA:
      var focusedData = action.data;
      focusData(focusedData);
      break;
    case ZipConstants.INIT_DATA:
      var data = action.allData;
      var plotTypes = action.plotTypes;
      initializeData(data, plotTypes);
      break;
    default:
      return true;
  }

  DataStore.emitChange();
  return true;
});

module.exports = DataStore;
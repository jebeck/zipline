var _ = require('lodash');
var crossfilter = require('crossfilter');

var DateTriggerFilter = function(data) {
  var crossData = crossfilter(data);

  var interval = _.every(data, function(d) {
    /* jshint eqnull: true */
    return d.start != null && d.end != null;
  });

  if (interval) {
    var dataByInterval = crossData.dimension(function(d) {
      return d.start + '/' + d.end;
    });
  }
  else {
    var dataByDatetime = crossData.dimension(function(d) {
      return Date.parse(d.time);
    }); 
  }

  function _findIntersecting(bounds) {
    return function(d) {
      var interval = d.split('/');
      var s = Date.parse(interval[0]), e = Date.parse(interval[1]);
      if (s < bounds[0] && e < bounds[0]) {
        return false;
      }
      else if (s > bounds[1] && e > bounds[1]) {
        return false;
      }
      else {
        return true;
      }
    };
  }

  var lastDate = null, cached = [];

  function _getCenterOfBounds(bounds) {
    return (bounds[0].valueOf() + bounds[1].valueOf())/2;
  }

  function _filter(bounds) {
    if (interval) {
      return _.sortBy(
        dataByInterval.filterFunction(_findIntersecting(bounds)).top(Infinity).reverse(),
        function(d) { return d.start; }
      );
    }
    else {
      return dataByDatetime.filter(bounds).top(Infinity).reverse();
    }
  }

  this.getLast = function() {
    if (interval) {
      return dataByInterval.top(1);
    }
    else {
      return dataByDatetime.top(1);
    }
  };

  this.filter = function(bounds, force) {
    var center = _getCenterOfBounds(bounds);
    if (force) {
      return _filter(bounds);
    }
    else if (Math.abs(center - lastDate) > 864e5) {
      lastDate = center;
      cached = _filter(bounds);
      return cached;
    }
    else {
      return cached;
    }
  };

  this.all = function() {
    return dataByDatetime.filterAll().top(Infinity).reverse();
  };

  return this;
};

module.exports = DateTriggerFilter;
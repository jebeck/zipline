var crossfilter = require('crossfilter');

var DateTriggerFilter = function(data) {
  var crossData = crossfilter(data);

  var dataByDatetime = crossData.dimension(function(d) {
    return new Date(d.offsetTime);
  });

  var lastDate = null;

  var centerOfBounds = function(bounds) {
    var total = bounds[1] - bounds[0];
    var center = new Date(bounds[0] + total/2);
    return center.toISOString().slice(0,10);
  };

  this.filter = function(bounds) {
    var center = centerOfBounds(bounds);
    if (center !== lastDate) {
      lastDate = center;
      return dataByDatetime.filter(bounds).top(Infinity);
    }
    else {
      return null;
    }
  };

  this.all = function() {
    return dataByDatetime.filterAll().top(Infinity);
  };

  return this;
};

module.exports = DateTriggerFilter;
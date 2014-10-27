var crossfilter = require('crossfilter');

var BasicFilter = function(data) {
  var crossData = crossfilter(data);
  var dataByDatetime = crossData.dimension(function(d) {
    return d.trueUtcTime.slice(0,10);
  });

  this.filter = function(bounds) {
    return dataByDatetime.filter(bounds).top(Infinity);
  };

  this.all = function() {
    return dataByDatetime.filterAll().top(Infinity);
  };

  return this;
};

module.exports = BasicFilter;
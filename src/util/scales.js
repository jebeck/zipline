var d3 = window.d3;
var _ = require('lodash');
var moment = require('moment');

module.exports = {
  zipscale: function(width, timespan, opts) {
    if (!width || width <= 0) {
      throw new Error('Sorry, the container width for the zipscale must be a positive number!');
    }
    if (!timespan || !(moment(timespan[0]).isValid() && moment(timespan[1]).isValid())) {
      throw new Error('Sorry, the timespan for the zipscale must consist of two valid datetimes.');
    }
    opts = opts || {};
    var defaults = {
      period: 86400000
    };
    _.defaults(opts, defaults);

    return d3.time.scale.utc()
      .domain(timespan)
      .range([0, width]);
  },
  hourcolorscale: function(c1, c2) {
    return d3.scale.linear()
      .domain([12, 0])
      .range([c1, c2])
      .interpolate(d3.interpolateHcl);
  }
};
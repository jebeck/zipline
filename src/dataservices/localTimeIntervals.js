var _ = require('lodash');
var d3 = require('d3');
var moment = require('moment-timezone');

module.exports = function(offsetIntervals, opts) {
  opts = opts || {};
  var defaults = {
    step: 3
  };
  _.defaults(opts, defaults);

  var lastDate = null, cached = [];
  
  return function(filterBounds) {
    bounds = [
      // because the left edge wasn't keeping up
      // and the interval duration doesn't pad on that side
      moment(filterBounds[0]).subtract(opts.step, 'hours'),
      filterBounds[1]
    ];
    var center = (bounds[0].valueOf() + bounds[1].valueOf())/2;
    if (Math.abs(center - lastDate) > 864e5) {
      var hours = d3.time.hour.utc.range(
        bounds[0],
        bounds[1]
      );
      
      var intersectingIntervals = offsetIntervals.filter(bounds, true);
      var retData = [];

      _.each(intersectingIntervals, function(interval, j) {
        var intervalStart = Date.parse(interval.start), intervalEnd = Date.parse(interval.end);
        if (j !== 0) {
          var nextHour = _.find(hours, function(d) {
            return d > intervalStart && moment(d).tz(interval.timezone).hour() % opts.step === 0;
          });
          var nextStep = moment(nextHour).tz(interval.timezone).hour();
          if (nextHour) {
            retData.push({
              time: intervalStart,
              duration: nextHour - intervalStart,
              localHour: nextHour !== 0 ? (nextStep - opts.step) : 24 - opts.step
            }); 
          }
        }
        retData = retData.concat(_.map(_.filter(hours, function(d) {
          if (d >= intervalStart && d < intervalEnd) {
            var hour = moment(d).tz(interval.timezone).hour();
            if (hour % opts.step === 0) {
              return true;
            }          
          }
          return false;
        }), function(d, i, data) {
          if (i < data.length - 1) {
            return {
              time: d.valueOf(),
              duration: data[i + 1].valueOf() - d.valueOf(),
              localHour: moment(d).tz(interval.timezone).hour()
            };
          }
          else {
            var limit = j === intersectingIntervals.length - 1 ? bounds[1] : intervalEnd;
            if (limit > intervalEnd) {
              limit = intervalEnd;
            }
            return {
              time: d.valueOf(),
              duration: limit - d.valueOf(),
              localHour: moment(d).tz(interval.timezone).hour()
            };
          }
        }));
      });

      lastDate = center;
      cached = retData;
      return retData; 
    }
    else {
      return cached;
    }
  };
};
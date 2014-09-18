var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var reuse = require('../util/reusenodes');

d3.chart('Background', {
  initialize: function() {
    var chart = this;

    var fill;

    var xPosition = function(d) {
      return chart.scale(d);
    };

    this.layer('fill', this.base.append('g'), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d;
        }));
        // commented out = vanilla enter selection, without reusing nodes
        // return this.selectAll('rect').data(data, function(d) {
        //   return d;
        // });
      },
      insert: function() {
        return this.append('rect')
          .attr({
            height: chart.height
          });
      },
      events: {
        merge: function() {
          this.attr({
            x: xPosition,
            y: chart.yOffset,
            width: function(d) {
              return chart.scale(d3.time.hour.utc.offset(d, chart.step)) - chart.scale(d);
            },
            fill: function(d) {
              return chart.opts.fillScale(moment(d).tz(chart.timezone).hour());
            }
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });

    this.layer('labels', this.base.append('g'), {
      dataBind: function(data) {
        return reuse(this.selectAll('text').data(data, function(d) {
          return d;
        }));
        // commented out = vanilla enter selection, without reusing nodes
        // return this.selectAll('rect').data(data, function(d) {
        //   return d;
        // });
      },
      insert: function() {
        return this.append('text')
          .attr({
            y: chart.yOffset + 25
          });
      },
      events: {
        merge: function() {
          this.attr({
            x: function(d) {
              return xPosition(d) + 10;
            },
            'class': 'Background-label'
          })
          .text(function(d) {
            return moment(d).tz(chart.timezone).format('MMM Do h:mm a');
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });
  },
  height: function(height) {
    if (!arguments.length) { return this.height; }
    this.height = height;
    return this;
  },
  opts: function(opts) {
    if (!arguments.length) { return this.opts; }
    this.opts = opts;
    return this;
  },
  scale: function(scale) {
    if (!arguments.length) { return this.scale; }
    this.scale = scale;
    return this;
  },
  step: function(step) {
    if (!arguments.length) { return this.step; }
    this.step = step;
    return this;
  },
  timezone: function(timezone) {
    if (!arguments.length) { return this.timezone; }
    this.timezone = timezone;
    return this;
  },
  transform: function(data) {
    return _.filter(data, function(d) {
      var hour = moment(d).tz(chart.timezone).hour();
      if (hour % chart.step === 0) {
        return true;
      }
      else {
        return false;
      }
    });
  },
  yOffset: function(yOffset) {
    if (!arguments.length) { return this.yOffset; }
    this.yOffset = yOffset;
    return this;
  }
});

var chart;

module.exports = {
  create: function(el, opts) {
    opts = opts || {};
    var defaults = {
      step: 3,
      yOffset: 0
    };
    _.defaults(opts, defaults);

    chart = d3.select(el).chart('Background')
      .height(opts.height)
      .opts(opts.opts)
      .scale(opts.scale)
      .step(opts.step)
      .timezone(opts.timezone)
      .yOffset(opts.yOffset);

    return chart;
  }
};
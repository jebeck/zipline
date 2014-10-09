var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var reuse = require('../../util/reusenodes');

d3.chart('Background', {
  initialize: function() {
    var chart = this;

    var fill;

    this.layer('Background-rects', this.base.append('g').attr({
      'class': 'Background-rects'
    }), {
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
        var h = chart.height();
        return this.append('rect')
          .attr({
            height: h,
            'class': 'Background-rect'
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale(), yOffset = chart.yOffset();
          var step = chart.step();
          var opts = chart.opts(), timezone = chart.timezone();
          this.attr({
            x: function(d) { return xScale(d); },
            y: yOffset,
            width: function(d) {
              return xScale(d3.time.hour.utc.offset(d, step)) - xScale(d);
            },
            fill: function(d) {
              return opts.fillScale(moment(d).tz(timezone).hour());
            }
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });

    this.layer('Background-labels', this.base.append('g').attr({
      'class': 'Background-labels'
    }), {
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
        var yOffset = chart.yOffset();
        return this.append('text')
          .attr({
            y: yOffset + 25,
            'class': 'Background-label'
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale(), timezone = chart.timezone();
          this.attr({
            x: function(d) {
              return xScale(d) + 10;
            }
          })
          .text(function(d) {
            return moment(d).tz(timezone).format('MMM Do h:mm a');
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    return this;
  },
  opts: function(opts) {
    if (!arguments.length) { return this._opts; }
    this._opts = opts;
    return this;
  },
  remove: function() {
    this.base.remove();

    return this;
  },
  step: function(step) {
    if (!arguments.length) { return this._step; }
    this._step = step;
    return this;
  },
  timezone: function(timezone) {
    if (!arguments.length) { return this._timezone; }
    this._timezone = timezone;
    return this;
  },
  transform: function(data) {
    var timezone = this.timezone(), step = this.step();
    return _.filter(data, function(d) {
      var hour = moment(d).tz(timezone).hour();
      if (hour % step === 0) {
        return true;
      }
      else {
        return false;
      }
    });
  },
  xScale: function(xScale) {
    if (!arguments.length) { return this._xScale; }
    this._xScale = xScale;
    return this;
  },
  yOffset: function(yOffset) {
    if (!arguments.length) { return this._yOffset; }
    this._yOffset = yOffset;
    return this;
  }
});

module.exports = function() {
  var chart;

  return {
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
        .xScale(opts.xScale)
        .step(opts.step)
        .timezone(opts.timezone)
        .yOffset(opts.yOffset);

      return this;
    },
    render: function(data) {
      chart.draw(data);
    },
    destroy: function() {
      chart.remove();

      return this;
    }
  };
};
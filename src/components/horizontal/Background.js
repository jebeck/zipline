var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var reuse = require('../../util/reusenodes');

d3.chart('Background', {
  initialize: function() {
    var chart = this;

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
            y: 0,
            'class': 'Background-rect'
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale();
          var step = chart.step();
          var opts = chart.opts(), timezone = chart.timezone();
          this.attr({
            fill: function(d) {
              return opts.fillScale(Math.abs(12 - moment(d).tz(timezone).hour()));
            },
            width: function(d) {
              var xScale = chart.xScale(), step = chart.step(), timezone = chart.timezone();
              var next = d3.time.hour.utc.offset(d, step);
              var nextHours = moment.utc(next).tz(timezone).hours();
              while (nextHours % step !== 0) {
                if (nextHours > step) {
                  next = d3.time.hour.utc.offset(d, (step - 1));
                  nextHours = moment.utc(next).tz(timezone).hours();
                }
                else if (nextHours < step) {
                  next = d3.time.hour.utc.offset(d, (step + 1));
                  nextHours = moment.utc(next).tz(timezone).hours();
                }
              }
              return xScale(next) - xScale(d);
            },
            x: function(d) { return xScale(d); }
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
  width: function(width) {
    if (!arguments.length) { return this._width; }
    this._width = width;
    return this;
  },
  xScale: function(xScale) {
    if (!arguments.length) { return this._xScale; }
    this._xScale = xScale;
    return this;
  }
});

module.exports = function() {
  var chart;

  return {
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {
        extension: 'Background',
        step: 3
      };
      _.defaults(opts, defaults);

      chart = el.chart(opts.extension)
        .height(opts.height)
        .opts(opts.opts)
        .step(opts.step)
        .timezone(opts.timezone)
        .width(opts.width)
        .xScale(opts.majorScale);

      return this;
    },
    render: function(data) {
      chart.draw(data);

      return this;
    }
  };
};
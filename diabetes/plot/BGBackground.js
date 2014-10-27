var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var zipline = require('../../src/');
var reuse = zipline.util.reuse;

var scales = require('../util/scales');

d3.chart('BGBackground', {
  initialize: function() {
    var chart = this;

    var xPosition = function(d) { return chart.xScale()(d); };
    var rectWidth = function(d) {
      var xScale = chart.xScale(), step = chart.step();
      return xScale(d3.time.hour.utc.offset(d, step)) - xScale(d);
    };

    this.layer('Background-rects--low', this.base.append('g').attr({
      'class': 'Background-rects--low'
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
        var height = chart.height();
        var yScale = chart.yScale();
        var categories = chart.opts().bgCategories;
        return this.append('rect')
          .attr({
            height: height - yScale(categories.low),
            y: function(d) { return yScale(categories.low); },
            'class': 'Background-rect--low'
          });
      },
      events: {
        merge: function() {
          var yScale = chart.yScale();
          var opts = chart.opts(), timezone = chart.timezone();
          this.attr({
            fill: function(d) { return opts.fillScales.low(Math.abs(12 - moment(d).tz(timezone).hour())); },
            width: rectWidth,
            x: xPosition
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });

    this.layer('Background-rects--target', this.base.append('g').attr({
      'class': 'Background-rects--target'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d;
        }));
      },
      insert: function() {
        var yScale = chart.yScale();
        var categories = chart.opts().bgCategories;
        return this.append('rect')
          .attr({
            height: yScale(categories.low) - yScale(categories.high),
            y: function(d) { return yScale(categories.high); },
            'class': 'Background-rect--target'
          });
      },
      events: {
        merge: function() {
          var yScale = chart.yScale();
          var opts = chart.opts(), timezone = chart.timezone();
          this.attr({
            x: xPosition,
            width: rectWidth,
            fill: function(d) { return opts.fillScales.target(Math.abs(12 - moment(d).tz(timezone).hour())); }
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });

    this.layer('Background-rects--high', this.base.append('g').attr({
      'class': 'Background-rects--high'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d;
        }));
      },
      insert: function() {
        var yScale = chart.yScale();
        var categories = chart.opts().bgCategories;
        return this.append('rect')
          .attr({
            height: yScale(categories.high),
            y: 0,
            'class': 'Background-rect--high'
          });
      },
      events: {
        merge: function() {
          var yScale = chart.yScale();
          var opts = chart.opts(), timezone = chart.timezone();
          this.attr({
            x: xPosition,
            width: rectWidth,
            fill: function(d) { return opts.fillScales.high(Math.abs(12 - moment(d).tz(timezone).hour())); }
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
    this.yScale(height);
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
  yScale: function(height) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = scales.bg(height, this.opts().r*2);
    return this;
  },
  width: function(width) {
    if (!arguments.length) { return this._width; }
    this._width = width;
    return this;
  }
});

module.exports = function() {
  var chart;

  return {
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {
        bgCategories: {
          low: 80,
          high: 180
        },
        extension: 'BGBackground',
        step: 3
      };
      _.defaults(opts, defaults);

      chart = el.chart(opts.extension)
        .opts(opts.opts)
        .height(opts.height)
        .step(opts.step)
        .timezone(opts.timezone)
        .width(opts.width)
        .xScale(opts.majorScale);

      return this;
    },
    render: function(data) {
      chart.draw(data);

      return this;
    },
    destroy: function() {
      chart.remove();

      return this;
    }
  };
};
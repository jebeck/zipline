var _ = require('lodash');
var d3 = window.d3;

var zipline = require('../../src/');
var reuse = zipline.util.reuse;

var scales = require('../util/scales');
var bg = require('../util/bg');

d3.chart('BGBackground', {
  initialize: function() {
    var chart = this;

    var xPosition = function(d) { return chart.xScale()(new Date(d.time)); };

    var rectWidth = function(d) {
      var xScale = chart.xScale();
      return xScale(new Date(d.time + d.duration)) - xScale(new Date(d.time));
    };

    var makeFillFn = function(category) {
      return function(d) { return chart.opts().fillScales[category](Math.abs(12 - d.localHour)); };
    };

    this.layer('Background-rects--low', this.base.append('g').attr({
      'class': 'Background-rects--low'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d.time;
        }));
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
          var yScale = chart.yScale(), opts = chart.opts();
          this.attr({
            fill: function(d) { return opts.fillScales.low(Math.abs(12 - d.localHour)); },
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
          return d.time;
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
          var yScale = chart.yScale(), opts = chart.opts();
          this.attr({
            x: xPosition,
            width: rectWidth,
            fill: function(d) { return opts.fillScales.target(Math.abs(12 - d.localHour)); }
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
          return d.time;
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
          var yScale = chart.yScale(), opts = chart.opts();
          this.attr({
            x: xPosition,
            width: rectWidth,
            fill: function(d) { return opts.fillScales.high(Math.abs(12 - d.localHour)); }
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
    opts = _.cloneDeep(opts);
    if (opts.bgCategories.units === 'mg/dL') {
      opts.bgCategories.low = bg.convertMgdlToMmol(opts.bgCategories.low);
      opts.bgCategories.high = bg.convertMgdlToMmol(opts.bgCategories.high);
    }
    this._opts = opts;
    return this;
  },
  remove: function() {
    this.base.remove();

    return this;
  },
  xScale: function(xScale) {
    if (!arguments.length) { return this._xScale; }
    this._xScale = xScale;
    return this;
  },
  yScale: function(height) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = scales.bg(height, this.opts().scaleR*2);
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
      var defaults = {};
      _.defaults(opts, defaults);

      chart = el.chart('BGBackground')
        .opts(opts.opts)
        .height(opts.height)
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
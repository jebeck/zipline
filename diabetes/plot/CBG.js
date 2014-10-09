var d3 = window.d3;

var zipline = require('../../src/');
var reuse = zipline.util.reuse;

var scales = require('../util/scales');

d3.chart('CBG', {
  initialize: function() {
    var chart = this;

    this.layer('CBG-circles', this.base.append('g').attr({
      'class': 'CBG-circles'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('circle').data(data, function(d) {
          return d.id;
        }));
      },
      insert: function() {
        var opts = chart.opts();
        return this.append('circle')
          .attr({
            r: opts.r,
            fill: opts.fill,
            'class': 'CBG-circle'
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale();
          var yScale = chart.yScale();
          this.attr({
            cx: function(d) {
              return xScale(new Date(d.trueUtcTime));
            },
            cy: function(d) {
              return yScale(d.value) + chart.yOffset();
            }
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
  xScale: function(xScale) {
    if (!arguments.length) { return this._xScale; }
    this._xScale = xScale;
    return this;
  },
  yScale: function(height) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = scales.bg(height, this.opts().r/2);
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
      var defaults = {};
      _.defaults(opts, defaults);

      chart = d3.select(el).chart('CBG')
        .opts(opts.opts)
        .height(opts.height)
        .xScale(opts.xScale)
        .yOffset(opts.yOffset);

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
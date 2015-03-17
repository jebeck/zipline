var _ = require('lodash');
var d3 = window.d3;

var reuse = require('../../util/reusenodes');

d3.chart('Background', {
  initialize: function() {
    var chart = this;

    this.layer('Background-rects', this.base.append('g').attr({
      'class': 'Background-rects'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d.time;
        }));
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
          var xScale = chart.xScale(), opts = chart.opts();
          this.attr({
            fill: function(d) {
              return opts.fillScale(Math.abs(12 - d.localHour));
            },
            width: function(d) {
              return xScale(new Date(d.time + d.duration)) - xScale(new Date(d.time));
            },
            x: function(d) { return xScale(new Date(d.time)); }
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
      var defaults = {};
      _.defaults(opts, defaults);

      chart = el.chart('Background')
        .opts(opts.opts)
        .height(opts.height)
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
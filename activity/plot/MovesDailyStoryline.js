var _ = require('lodash');
var d3 = window.d3;

var zipline = require('../../src/');
var reuse = zipline.util.reuse;

d3.chart('MovesDailyStoryline', {
  initialize: function() {
    var chart = this;

    this.layer('MovesDailyStoryline-rects', this.base.append('g').attr({
      'class': 'MovesDailyStoryline-rects'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('rect').data(data, function(d) {
          return d.id;
        }));
      },
      insert: function() {
        var opts = chart.opts();
        return this.append('rect')
          .attr({
            y: opts.pad.top,
            height: chart.height() - opts.pad.top - opts.pad.bottom
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale();
          this.attr({
            x: function(d) { return xScale(new Date(d.time)); },
            width: function(d) {
              return xScale(new Date(Date.parse(d.time) + d.duration)) - xScale(new Date(d.time));
            },
            'class': function(d) {
              return d.subType + ' MovesDailyStoryline-rect';
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

      chart = el.chart('MovesDailyStoryline')
        .height(opts.height)
        .opts(opts.opts)
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
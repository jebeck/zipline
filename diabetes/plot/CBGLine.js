var d3 = window.d3;

var zipline = require('../../src/');
var reuse = zipline.util.reuse;

var scales = require('../util/scales');

d3.chart('CBGLine', {
  initialize: function() {
    var chart = this;
  },
  bgFillScale: function(bgCategories) {
    if (!arguments.length) { return this._bgFillScale; }
    this._bgFillScale = scales.bgFill(bgCategories);
    return this;
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
    this.bgFillScale(opts.bgCategories);
    return this;
  },
  remove: function() {
    this.base.remove();
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
  },
  yScale: function(height) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = scales.bg(height, this.opts().r*2);
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

      chart = el.chart('CBGLine')
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
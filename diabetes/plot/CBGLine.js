var d3 = window.d3;

var scales = require('../util/scales');

d3.chart('CBGLine', {
  initialize: function() {
    var chart = this;

    var cbgLine = function(xScale, yScale) {
      return d3.svg.line()
        .x(function(d) { return xScale(new Date(d.offsetTime)); })
        .y(function(d) { return yScale(d.value); })
        .interpolate('linear');
    };

    this.layer('CBG-plot', this.base.append('g').attr({
      'class': 'CBG-plot'
    }), {
      dataBind: function(data) {
        return this.selectAll('path')
          .data([data]);
      },
      insert: function() {
        var clipPathUrl = chart.base.select('.ClipPath').attr('id');
        return this.append('path')
          .attr({
            'clip-path': 'url(#' + clipPathUrl + ')',
            fill: 'none',
            stroke: 'rgba(0,0,0,0)',
            'stroke-width': 2,
            'marker-start': 'url(#CBG-lineMarker)',
            'marker-mid': 'url(#CBG-lineMarker)',
            'marker-end': 'url(#CBG-lineMarker)'
          });
      },
      events: {
        enter: function() {
          var xScale = chart.xScale(), yScale = chart.yScale();
          var pathGenerator = cbgLine(xScale, yScale);
          
          this.attr({
            d: function(d) { return pathGenerator(d); }
          });
        }
      }
    });
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
  id: function(id) {
    if (!arguments.length) { return this._id; }
    this._id = id;
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
    this._yScale = scales.bg(height, this.opts().scaleR*2);
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
        .id(opts.id)
        .width(opts.width)
        .xScale(opts.xScale);

      return this;
    },
    render: function(data) {
      chart.draw(data);

      return this;
    }
  };
};
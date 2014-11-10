var d3 = window.d3;

var scales = require('../util/scales');

d3.chart('SMBGCircle', {
  initialize: function() {
    var chart = this;

    this.layer('SMBG-circles', this.base.append('g').attr({
      'class': 'SMBG-circles'
    }), {
      dataBind: function(data) {
        var clipPathUrl = chart.base.select('.ClipPath').attr('id');
        
        return this.attr({
            'clip-path': 'url(#' + clipPathUrl + ')'
          })
          .selectAll('circle')
          .data(data);
      },
      insert: function() {
        var opts = chart.opts();

        return this.append('circle')
          .attr({
            r: opts.r,
            'class': 'SMBG-circle'
          });
      },
      events: {
        enter: function() {
          var xScale = chart.xScale(), yScale = chart.yScale();
          var opts = chart.opts();

          this.attr({
            cx: function(d) {
              return xScale(new Date(d.trueUtcTime));
            },
            cy: function(d) {
              return yScale(d.value);
            },
            fill: opts.bgFillColor ? opts.bgFillColor : bgFill
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

      chart = el.chart('SMBGCircle')
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
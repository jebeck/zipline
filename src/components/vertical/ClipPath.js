var d3 = window.d3;

d3.chart('ClipPath', {
  initialize: function() {
    var chart = this;

    this.layer('ClipPaths', this.base.append('g').attr({
      'class': 'ClipPaths'
    }), {
      dataBind: function() {
        return this.selectAll('clipPath')
          .data([chart.id()], function(d) { return d; });
      },
      insert: function() {
        return this.append('clipPath')
          .attr({
            id: chart.id(),
            'class': 'ClipPath'
          })
          .append('rect')
          .attr({
            x: 0,
            y: 0,
            width: chart.width(),
            height: chart.height()
          });
      }
    });

  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    return this;
  },
  id: function(id) {
    if (!arguments.length) { return this._id; }
    this._id = id;
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
  }
});

module.exports = function() {
  var chart;

  return {
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {};
      _.defaults(opts, defaults);

      chart = el.chart('ClipPath')
        .height(opts.height)
        .id(opts.id)
        .width(opts.width);

      return this;
    },
    render: function() {
      chart.draw();

      return this;
    }
  };
};
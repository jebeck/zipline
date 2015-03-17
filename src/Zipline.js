var _ = require('lodash');
var d3 = window.d3;

var ZipActions = require('./actions/ZipActions');
var scales = require('./util/scales');
var timer = require('./util/timer');

d3.chart('Zipline', {
  initialize: function() {
    var chart = this;

    var makeSliceFn = function() {
      chart.slices = {};
      return function(d, el, adjusted) {
        var horizontal = chart.scrollDirection() === 'horizontal';
        var slice = d.background().create(el, {
          height: adjusted.height,
          majorScale: chart.scale(),
          opts: d.drawOpts,
          width: horizontal ? chart.width() : adjusted.width
        });
        chart.slices[d.id] = slice;
        _.each(d.plots, function(p) {
          var sliver = p.chart().create(el, {
            height: adjusted.height,
            majorScale: chart.scale(),
            opts: p.drawOpts,
            width: horizontal ? chart.width() : adjusted.width
          });
          chart.slices[p.id] = sliver;
        });
      };
    };

    this.layer('Slices', this.base, {
      dataBind: function(data) {
        return this.selectAll('.Slice')
          .data(data);
      },
      insert: function() {
        return this;
      },
      events: {
        update: function() {
          var sliceFn = makeSliceFn();

          function getLabel(d) {
            return d3.select('#' + d.id + 'Label');
          }

          var node = this;
          var horizontal = chart.scrollDirection() === 'horizontal';
          this.append('svg')
            .attr({
              width: chart.width(),
              height: function(d, i) {
                if (horizontal) {
                  return node[0][i].offsetHeight;
                }
                else {
                  return chart.height();
                }
              }
            })
            .append('g')
            .attr({
              id: function(d) { return d.id; },
              'class': 'Slice-group',
              transform: function(d) {
                var label = getLabel(d);
                var labelHeight = 0;
                if (!label.empty()) {
                  labelHeight = label[0][0].offsetHeight;
                }
                return 'translate(0,' + labelHeight + ')';
              }
            })
            .each(function(d, i) {
              var label = getLabel(d);
              var adjustedHeight = node[0][i].offsetHeight;
              if (!label.empty()) {
                adjustedHeight = node[0][i].offsetHeight - label[0][0].offsetHeight;
              }
              var adjustedWidth = node[0][i].offsetWidth;
              sliceFn(d, d3.select(this), {width: adjustedWidth, height: adjustedHeight});
            });
        }
      }
    });
  },
  clear: function() {
    this.base.selectAll('svg').remove();

    return this;
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    return this;
  },
  scale: function(scale) {
    if (!arguments.length) { return this._scale; }
    this._scale = scale;
    return this;
  },
  scrollDirection: function(scrollDirection) {
    if (!arguments.length) { return this._scrollDirection; }
    this._scrollDirection = scrollDirection;
    return this;
  },
  width: function(width) {
    if (!arguments.length) { return this._width; }
    this._width = width;
    return this;
  }
});

module.exports = function() {
  var chart, node, horizontal, timespan, scrollPosition;

  function getDimensions() {
    var scale = scales.zipscale(horizontal ? node.offsetWidth :
      node.offsetHeight, timespan.single);
    var scaleExtent = Math.abs(scale(timespan.total[0]) - scale(timespan.total[1]));

    var width = horizontal ? scaleExtent : node.offsetWidth;
    var height = horizontal ? node.offsetHeight : scaleExtent;

    return {width: width, height: height, scale: scale};
  }

  return {
    clear: function() {
      chart.clear();

      return this;
    },
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {
        scroll: 'horizontal'
      };
      _.defaults(opts, defaults);

      node = el;
      horizontal = opts.scroll === 'horizontal';
      timespan = opts.timespan;

      var dims = getDimensions();

      chart = d3.select(el)
        .chart('Zipline')
        .height(dims.height)
        .scale(dims.scale)
        .scrollDirection(opts.scroll)
        .width(dims.width);

      var scrolls = d3.select('.Zipline');
      scrolls.classed({
        'Zipline--horizontalScroll': horizontal,
        'Zipline--verticalScroll': !horizontal
      });

      scrolls.on('scroll', function() {
        var scrollProp = horizontal ? 'scrollLeft' : 'scrollTop';
        var newDate = chart.scale().invert(scrolls.property(scrollProp));
        scrollPosition = newDate;
        ZipActions.filterData([
          d3.time.day.utc.offset(newDate, -1),
          d3.time.day.utc.offset(newDate, 2)
        ]);
      });

      return this;
    },
    configure: function(slices) {
      chart.draw(slices);

      return this;
    },
    relocate: function(edge) {
      var scrolls = d3.select('.Zipline'), scale = chart.scale();
      if (horizontal) {
        scrolls.property('scrollLeft', scale(edge));
      }
      else {
        scrolls.property('scrollTop', scale(edge));
      }

      return this;
    },
    render: function(slices) {
      _.forIn(slices, function(slice, sliceId) {
        if (chart.slices[sliceId] && !_.isEmpty(slice)) {
          chart.slices[sliceId].render(slice);
        }
      });

      return this;
    },
    resize: function() {
      var dims = getDimensions();

      chart.height(dims.height)
        .scale(dims.scale)
        .width(dims.width);

      return scrollPosition;
    }
  };
};
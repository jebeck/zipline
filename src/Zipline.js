var _ = require('lodash');
var d3 = window.d3;
var EventEmitter = require('events').EventEmitter;
var moment = require('moment-timezone');

var scales = require('./util/scales');

d3.chart('Zipline', {
  initialize: function() {
    this.emitter = new EventEmitter();

    var chart = this;

    var makeSliceFn = function(bounds) {
      chart.slices = [];
      return function(d, el, adjustedHeight) {
        var slice = d.chart().create(el, {
          extension: d.extension,
          height: adjustedHeight,
          majorScale: chart.scale(),
          opts: d.opts,
          timezone: chart.timezone(),
          width: chart.width()
        });
        slice.data = d.data;
        chart.slices.push(slice);
        _.each(d.plot, function(p) {
          var sliver = p.chart().create(el, {
            height: adjustedHeight,
            majorScale: chart.scale(),
            opts: p.opts,
            timezone: chart.timezone(),
            width: chart.width()
          });
          sliver.data = p.data;
          chart.slices.push(sliver);
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
          var bounds = chart.location().bounds;
          var sliceFn = makeSliceFn(bounds);

          function getLabel(d) {
            return d3.select('#' + d.id + 'Label');
          }

          var node = this;
          this.append('svg')
            .attr({
              width: chart.width(),
              height: function(d, i) {
                return node[0][i].offsetHeight;
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
              sliceFn(d, d3.select(this), adjustedHeight);
            });
        }
      }
    });
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    return this;
  },
  location: function(location) {
    if (!arguments.length) { return this._location; }
    this._location = location;
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
  timezone: function(timezone) {
    if (!arguments.length) { return this._timezone; }
    this._timezone = timezone;
    return this;
  },
  width: function(width) {
    if (!arguments.length) { return this._width; }
    this._width = width;
    return this;
  }
});

var chart;

module.exports = {
  create: function(el, timezone, opts) {
    opts = opts || {};
    var now = moment().utc();
    var defaults = {
      scroll: 'horizontal',
      timespan: {
        initial: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).startOf('year').add(1, 'days').toDate()
        ],
        total: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).endOf('year').toDate()
        ]
      },
      location: {
        bounds: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).startOf('year').add(1, 'days').toDate()
        ]
      },
      timezone: timezone,
      yOffset: 0
    };
    _.defaults(opts, defaults);

    var horizontal = opts.scroll === 'horizontal';

    function getFromDimensions(el) {
      var scale = scales.zipscale(horizontal ? el.offsetWidth : el.offsetHeight, opts.timespan.initial);
      var scaleExtent = Math.abs(scale(opts.timespan.total[0]) - scale(opts.timespan.total[1]));

      var width = horizontal ? scaleExtent : el.offsetWidth;
      var height = horizontal ? el.offsetHeight : scaleExtent;
      return {width: width, height: height, scale: scale};
    }

    var dims = getFromDimensions(el);

    chart = d3.select(el)
      .chart('Zipline')
      .height(dims.height)
      .location(opts.location)
      .scale(dims.scale)
      .scrollDirection(opts.scroll)
      .timezone(opts.timezone)
      .width(dims.width);

    var scrolls = d3.select('.Zipline');
    scrolls.classed({
      'Zipline--horizontalScroll': horizontal,
      'Zipline--verticalScroll': !horizontal
    });
    if (horizontal) {
      scrolls.property('scrollLeft', dims.scale(opts.location.bounds[0]));
    }
    else {
      scrolls.property('scrollHeight', dims.scale(opts.location.bounds[0]));
    }

    scrolls.on('scroll', function() {
      var scrollProp = chart.scrollDirection() === 'horizontal' ? 'scrollLeft' : 'scrollHeight';
      var newDate = chart.scale().invert(scrolls.property(scrollProp));
      chart.location({
        bounds: [newDate, d3.time.day.utc.offset(newDate, 1)],
        center: d3.time.hour.utc.offset(newDate, 12)
      });

      _.each(chart.slices, function(slice) {
        var bounds = chart.location().bounds;
        slice.render(slice.data(bounds));
      });
    });

    return this;
  },
  render: function(data) {
    chart.draw(data);

    // initial draw
    _.each(chart.slices, function(slice) {
      var bounds = chart.location().bounds;
      slice.render(slice.data(bounds));
    });

    return this;
  }
};
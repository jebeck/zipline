var _ = require('lodash');
var d3 = window.d3;
var EventEmitter = require('events').EventEmitter;
var moment = require('moment-timezone');

var scales = require('./util/scales');

// match 10px value in Zip.less
// unless can figure out a way to set it in both files via option
// best to hardcode it to maintain consistency
var SCROLLGUTTER = 10;

d3.chart('Zipline', {
  initialize: function() {
    this.emitter = new EventEmitter();

    var chart = this;

    var slices;

    var scrollContainer = d3.select(this.base.node().parentNode);

    var getBounds = function(dt) {
      return [
        dt,
        d3.time.day.utc.offset(dt, 1)
      ];
    };

    var makeHorizontalSliceFn = function(bounds, numSlices) {
      slices = [];
      return function(d, i) {
        var slice = d.chart().create(this, {
          height: chart.height()/numSlices,
          opts: d.opts,
          timezone: chart.timezone(),
          xScale: chart.scale(),
          yOffset: i * chart.height()/numSlices
        });
        slice.data = d.data;
        slices.push(slice);
        _.each(d.plot, function(p) {
          var sliver = p.chart().create(this, {
            height: chart.height()/numSlices,
            opts: p.opts,
            timezone: chart.timezone(),
            xScale: chart.scale(),
            yOffset: i * chart.height()/numSlices
          });
          sliver.data = p.data;
          slices.push(sliver);
        }, this);
      };
    };

    var makeVerticalSliceFn = function(bounds, numSlices) {
      slices = [];
      return function(d, i) {
        var slice = d.chart().create(this, {
          width: chart.width()/numSlices,
          opts: d.opts,
          timezone: chart.timezone(),
          xOffset: i * chart.width()/numSlices,
          yScale: chart.scale()
        });
        slice.data = d.data;
        slices.push(slice);
        _.each(d.plot, function(p) {
          var sliver = p.chart().create(this, {
            width: chart.width()/numSlices,
            opts: p.opts,
            timezone: chart.timezone(),
            xOffset: i * chart.width()/numSlices,
            yScale: chart.scale()
          });
          sliver.data = p.data;
          slices.push(sliver);
        }, this);
      };
    };

    scrollContainer.on('scroll', function() {
      var scrollProp = chart.scrollDirection() === 'horizontal' ? 'scrollLeft' : 'scrollHeight';
      var newDate = chart.scale().invert(scrollContainer.property(scrollProp));
      chart.location({
        bounds: getBounds(newDate),
        center: d3.time.hour.utc.offset(newDate, 12)
      });

      _.each(slices, function(slice) {
        var bounds = chart.location().bounds;
        slice.render(slice.data(bounds));
      });
    });

    this.layer('slices', this.base, {
      dataBind: function(data) {
        return this.selectAll('g')
          .data(data);
      },
      insert: function() {
        return this.append('g')
          .attr({
            'class': 'Slice'
          });
      },
      events: {
        enter: function() {
          var bounds = chart.location().bounds;
          var numSlices = this.data().length;
          var sliceFn = chart.scrollDirection() === 'horizontal' ?
            makeHorizontalSliceFn(bounds, numSlices) :
              makeVerticalSliceFn(bounds, numSlices);
          this.attr({
            id: function(d) { return d.id; }
          })
          .each(sliceFn);
        },
        update: function() {
          _.each(slices, function(slice) { slice.destroy(); });
          var bounds = chart.location().bounds;
          var numSlices = this.data().length;
          var sliceFn = chart.scrollDirection() === 'horizontal' ?
            makeHorizontalSliceFn(bounds, numSlices) :
              makeVerticalSliceFn(bounds, numSlices);
          this.each(sliceFn);
        }
      }
    });
  },
  config: function(config) {
    if (!arguments.length) { return this._config; }
    this._config = config;
    return this;
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this.base.attr('height', height);
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
    this.base.attr('width', width);
    this._width = width;
    return this;
  },
  transform: function(data) {
    this.config(data);
    return data;
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
      timezone: timezone
    };
    _.defaults(opts, defaults);

    var horizontal = opts.scroll === 'horizontal';

    function getFromDimensions(el) {
      var scale = scales.zipscale(horizontal ? el.offsetWidth : el.offsetHeight, opts.timespan.initial);
      var scaleExtent = Math.abs(scale(opts.timespan.total[0]) - scale(opts.timespan.total[1]));

      var width = horizontal ? scaleExtent : el.offsetWidth - SCROLLGUTTER;
      var height = horizontal ? el.offsetHeight - SCROLLGUTTER : scaleExtent;
      return {width: width, height: height, scale: scale};
    }

    var dims = getFromDimensions(el);

    chart = d3.select(el)
      .append('svg')
      .chart('Zipline')
      .width(dims.width)
      .height(dims.height)
      .location(opts.location)
      .scale(dims.scale)
      .scrollDirection(opts.scroll)
      .timezone(opts.timezone);

    d3.select(window).on('resize', _.throttle(function() {
      var dims = getFromDimensions(el);
      chart.width(dims.width)
        .height(dims.height)
        .scale(dims.scale);
      chart.draw(chart.config());
    }, 500));

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

    return chart;
  }
};

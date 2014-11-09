var _ = require('lodash');
var d3 = window.d3;
var EventEmitter = require('events').EventEmitter;
var moment = require('moment-timezone');

var scales = require('./util/scales');
var timer = require('./util/timer');

d3.chart('Zipline', {
  initialize: function() {
    var chart = this;

    var makeSliceFn = function(bounds) {
      chart.slices = [];
      return function(d, el, adjusted) {
        var horizontal = chart.scrollDirection() === 'horizontal';
        var slice = d.background().create(el, {
          extension: d.extension,
          height: adjusted.height,
          majorScale: chart.scale(),
          opts: d.opts,
          timezone: chart.timezone(),
          width: horizontal ? chart.width() : adjusted.width
        });
        slice.data = d.data;
        slice.once = d.once;
        chart.slices.push(slice);
        _.each(d.plot, function(p) {
          var sliver = p.chart().create(el, {
            height: adjusted.height,
            majorScale: chart.scale(),
            opts: p.opts,
            timezone: chart.timezone(),
            width: horizontal ? chart.width() : adjusted.width
          });
          sliver.data = p.data;
          sliver.once = p.once;
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

module.exports = function() {
  var chart, emitter = new EventEmitter();

  return {
    clear: function() {
      chart.clear();

      return this;
    },
    create: function(el, timezone, opts) {
      opts = opts || {};
      var now = moment().utc();
      var defaults = {
        scroll: 'horizontal',
        timespan: {
          first: [
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

      var dims = this.getDimensions(el, horizontal, opts.timespan);

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

      scrolls.on('scroll', function() {
        var scrollProp = chart.scrollDirection() === 'horizontal' ? 'scrollLeft' : 'scrollTop';
        var newDate = chart.scale().invert(scrolls.property(scrollProp));
        chart.location({
          bounds: [newDate, d3.time.day.utc.offset(newDate, 1)],
          center: d3.time.hour.utc.offset(newDate, 12)
        });
        emitter.emit('navigatedToCenter', chart.location().center.toISOString());

        _.each(chart.slices, function(slice) {
          if (!slice.once) {
            var bounds = chart.location().bounds;
            var data = slice.data(bounds);
            slice.render(slice.data(bounds));
          }
        });
      });

      return this;
    },
    emitter: emitter,
    getDimensions: function(el, horizontal, timespan) {
      var scale = scales.zipscale(horizontal ? el.offsetWidth : el.offsetHeight, timespan.first);
      var scaleExtent = Math.abs(scale(timespan.total[0]) - scale(timespan.total[1]));

      var width = horizontal ? scaleExtent : el.offsetWidth;
      var height = horizontal ? el.offsetHeight : scaleExtent;
      return {width: width, height: height, scale: scale};
    },
    relocate: function(bounds) {
      bounds = bounds || chart.location().bounds;
      var scrolls = d3.select('.Zipline'), scale = chart.scale();
      if (chart.scrollDirection() === 'horizontal') {
        scrolls.property('scrollLeft', scale(bounds[0]));
      }
      else {
        scrolls.property('scrollTop', scale(bounds[0]));
      }
    },
    render: function(data) {
      var bounds = chart.location().bounds;

      chart.draw(data);

      // initial draw
      timer.start('Initial Draw');
      _.each(chart.slices, function(slice) {
        slice.render(slice.data(bounds));
      });
      timer.end('Initial Draw');

      return this;
    },
    resize: function(dims) {
      chart.height(dims.height)
        .scale(dims.scale)
        .width(dims.width);

      return this;
    }
  };
};
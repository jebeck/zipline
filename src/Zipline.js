var d3 = window.d3;
var EventEmitter = require('events').EventEmitter;
var moment = require('moment-timezone');

var scales = require('./util/scales');

d3.chart('Zipline', {
  initialize: function() {
    this.width = this.base.attr('width');
    this.height = this.base.attr('height') - 10;
    this.emitter = new EventEmitter();

    var chart = this;

    var slices = [];

    var scrollContainer = d3.select(this.base.node().parentNode);

    var getBounds = function(dt) {
      return [
        moment(dt).toDate(),
        moment(dt).add(1, 'days').toDate()
      ];
    };

    scrollContainer.on('scroll', function() {
      var scrollProp = chart.scrollDirection === 'horizontal' ? 'scrollLeft' : 'scrollHeight';
      var newDate = chart.scale.invert(scrollContainer.property(scrollProp));
      chart.location = {
        bounds: getBounds(newDate),
        center: moment(newDate).add(12, 'hours').toDate()
      };

      _.each(slices, function(slice) {
        var bounds = chart.location.bounds;
        slice.draw(slice.data(bounds));
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
          var bounds = chart.location.bounds;
          var numSlices = this.data().length;
          this.attr({
            id: function(d) { return d.id; }
          })
          .each(function(d, i) {
            var slice = d.chart.create(this, {
              height: chart.height/numSlices,
              opts: d.opts,
              scale: chart.scale,
              timezone: chart.timezone,
              yOffset: i * chart.height/numSlices
            });
            slice.data = d.data;
            slices.push(slice);
            _.each(d.plot, function(p) {
              var sliver = p.chart.create(this, {
                height: chart.height/numSlices,
                opts: p.opts,
                timezone: chart.timezone,
                xScale: chart.scale,
                yOffset: i * chart.height/numSlices
              });
              sliver.data = p.data;
              slices.push(sliver);
            }, this);
          });
        }
      }
    });
  },
  location: function(location) {
    if (!arguments.length) { return this.location; }
    this.location = location;
    return this;
  },
  scale: function(scale) {
    if (!arguments.length) { return this.scale; }
    this.scale = scale;
    return this;
  },
  scrollDirection: function(scrollDirection) {
    if (!arguments.length) { return this.scrollDirection; }
    this.scrollDirection = scrollDirection;
    return this;
  },
  timezone: function(timezone) {
    if (!arguments.length) { return this.timezone; }
    this.timezone = timezone;
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
      timezone: timezone
    };
    _.defaults(opts, defaults);

    var horizontal = opts.scroll === 'horizontal';
    var scale = scales.zipscale(horizontal ? el.offsetWidth : el.offsetHeight, opts.timespan.initial);
    var scaleExtent = Math.abs(scale(opts.timespan.total[0]) - scale(opts.timespan.total[1]));

    var width = horizontal ? scaleExtent : el.offsetWidth;
    var height = horizontal ? el.offsetHeight : scaleExtent;

    chart = d3.select(el)
      .append('svg')
      .attr({
        width: width,
        height: height - 10
      })
      .chart('Zipline')
      .location(opts.location)
      .scale(scale)
      .scrollDirection(opts.scroll)
      .timezone(opts.timezone);

    var scrolls = d3.select('.Zipline');
    scrolls.classed({
      'Zipline--horizontalScroll': horizontal,
      'Zipline--verticalScroll': !horizontal
    });
    if (horizontal) {
      scrolls.property('scrollLeft', scale(opts.location.bounds[0]));
    }
    else {
      scrolls.property('scrollHeight', scale(opts.location.bounds[0]));
    }

    return chart;
  }
};

var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

d3.chart('StackedDayBackground', {
  initialize: function() {
    var chart = this;

    this.layer('Background-rects', this.base.append('g').attr({
      'class': 'Background-rects'
    }), {
      dataBind: function(data) {
        var dayStr = moment(chart.xScale().domain()[0]).tz(chart.timezone()).format('dddd');
        var dayClass = 'Background-rects--' + dayStr.toLowerCase();
        return this.attr({
            id: chart.id()
          })
          .classed(dayClass, true)
          .selectAll('rect')
          .data(data, function(d) { return d.start; });
      },
      insert: function() {
        var gutter = chart.opts().gutter;
        var domain = chart.xScale().domain(), yScale = chart.yScale();
        return this.append('rect')
          .attr({
            height: function(d) {
              return yScale(domain[1]) - yScale(domain[0]) - gutter*2;
            },
            y: gutter,
            'class': 'Background-rect'
          });
      },
      events: {
        enter: function() {
          var opts = chart.opts(), timezone = chart.timezone();
          var xScale = chart.xScale();
          this.attr({
            fill: function(d) {
              return opts.fillScale(Math.abs(12 - moment(d.start).tz(timezone).hour()));
            },
            width: function(d) {
              return xScale(d.end) - xScale(d.start);
            },
            x: function(d) { return xScale(d.start); }
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
  id: function(id) {
    if (!arguments.length) { return this._id; }
    this._id = id;
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
  step: function(step) {
    if (!arguments.length) { return this._step; }
    this._step = step;
    return this;
  },
  timezone: function(timezone) {
    if (!arguments.length) { return this._timezone; }
    this._timezone = timezone;
    return this;
  },
  transform: function(data) {
    var timezone = this.timezone(), step = this.step();
    var dates = [];
    var firstDay = moment(data[0]).tz(timezone).date();
    _.each(data, function(d, i, data) {
      var hour = moment(d).tz(timezone).hour();
      var day = moment(d).tz(timezone).date();
      if (hour % step === 0 && day === firstDay) {
        dates.push({ start: d });
      }
    });
    _.map(dates, function(d, i, data) {
      if (i !== data.length - 1) {
        d.end = new Date(d.start.valueOf() + (data[i + 1].start - d.start));
      }
      else {
        d.end = new Date(d.start.valueOf() +
          (moment(d.start).tz(this.timezone()).startOf('day').add(1, 'days').valueOf() - d.start));
      }
    }, this);
    return dates;
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
  yScale: function(yScale) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = yScale;
    return this;
  }
});

module.exports = function() {
  var chart;

  return {
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {
        step: 3
      };
      _.defaults(opts, defaults);

      chart = el.chart('StackedDayBackground')
        .height(opts.height)
        .id(opts.id)
        .opts(opts.opts)
        .step(opts.step)
        .timezone(opts.timezone)
        .width(opts.width)
        .xScale(opts.xScale)
        .yScale(opts.yScale);

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
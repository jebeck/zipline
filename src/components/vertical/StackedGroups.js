var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var reuse = require('../../util/reusenodes');
var scales = require('../../util/scales');

d3.chart('StackedGroups', {
  initialize: function() {
    var chart = this;

    // likely factor this out into weekly chart config
    this.base.insert('defs', 'g')
      .append('marker')
      .attr({
        id: 'CBG-lineMarker',
        markerWidth: 2,
        markerHeight: 2,
        refX: 1,
        refY: 1
      })
      .append('circle')
      .attr({
        cx: 1,
        cy: 1,
        r: 1,
        stroke: 'none',
        fill: 'white'
      });

    this.layer('Stacked-groups', this.base.append('g').attr({
      'class': 'Stacked-groups'
    }), {
      dataBind: function(data) {
        return this.selectAll('g.Stacked-group').data(data, function(d) {
          return d;
        });
      },
      insert: function() {
        return this.append('g')
          .attr({
            'class': 'Stacked-group'
          });
      },
      events: {
        enter: function() {
          var opts = chart.opts(), yScale = chart.yScale();
          var height = chart.height()/chart.opts().daysInView;
          var tz = chart.timezone();
          this.attr({
            id: function(d) { return moment(d).tz(tz).format('YYYY-MM-DD'); },
            transform: function(d) {
              return 'translate(' + opts.labelGutter + ',' + yScale(d) + ')';
            }
          })
          .each(function(d) {
            var day = moment(d).tz(tz).format('YYYY-MM-DD');
            var domain = [d, moment(d).tz(tz).add(1, 'days')];
            var background = opts.embeddedChart.background().create(d3.select(this), {
              height: height,
              id: opts.embeddedChart.id(day),
              opts: opts.embeddedChart.opts,
              timezone: tz,
              width: chart.width() - opts.labelGutter,
              xScale: scales.zipscale(chart.width() - opts.labelGutter, domain),
              yScale: chart.yScale()
            });
            background.render(opts.embeddedChart.data(domain));
            for (var i = 0; i < opts.embeddedChart.plot.length; ++i) {
              var plotConfig = opts.embeddedChart.plot[i];
              var plot = plotConfig.chart().create(d3.select(this), {
                height: height,
                id: plotConfig.id(day),
                opts: plotConfig.opts || {},
                width: chart.width() - opts.labelGutter,
                xScale: scales.zipscale(chart.width() - opts.labelGutter, domain)
              });
              plot.render(plotConfig.data(domain));
            }
          });
        }
      }
    });

    this.layer('Stacked-backgrounds', this.base.append('g').attr({
      'class': 'Stacked-backgrounds'
    }), {
      dataBind: function(data) {
        return this.selectAll('rect.Stacked-background').data(data, function(d) {
          return d;
        });
      },
      insert: function() {
        var opts = chart.opts();
        return this.append('rect')
          .attr({
            x: 0,
            width: opts.labelGutter,
            'class': 'Stacked-background'
          });
      },
      events: {
        enter: function() {
          var tz = chart.timezone(), yScale = chart.yScale();
          this.attr({
            height: function(d) {
              var next = moment(d).tz(tz).add(1, 'days');
              return yScale(next) - yScale(d) - 2;
            },
            y: function(d) {
              return yScale(d) + 1;
            }
          });
        }
      }
    });

    this.layer('Stacked-boxes', this.base.append('g').attr({
      'class': 'Stacked-boxes'
    }), {
      dataBind: function(data) {
        return this.selectAll('rect.Stacked-box').data(data, function(d) {
          return d;
        });
      },
      insert: function() {
        var opts = chart.opts();
        return this.append('rect')
          .attr({
            rx: 5,
            ry: 5,
            x: opts.labelGutter/20,
            width: opts.labelGutter - opts.labelGutter/10,
            'class': 'Stacked-box'
          });
      },
      events: {
        enter: function() {
          var tz = chart.timezone(), yScale = chart.yScale();
          this.attr({
            height: function(d) {
              var next = moment(d).tz(tz).add(1, 'days');
              return (yScale(next) - yScale(d))/2;
            },
            y: function(d) {
              var next = moment(d).tz(tz).add(1, 'days');
              return yScale(d) + (yScale(next) - yScale(d))/4;
            }
          });
        }
      }
    });

    this.layer('Stacked-labels', this.base.append('g').attr({
      'class': 'Stacked-labels'
    }), {
      dataBind: function(data) {
        return this.selectAll('text').data(data, function(d) {
          return d;
        });
      },
      insert: function() {
        var opts = chart.opts();
        return this.append('text')
          .attr({
            x: opts.labelGutter/2,
            'class': 'Stacked-label'
          });
      },
      events: {
        enter: function() {
          var yScale = chart.yScale(), opts = chart.opts();
          var tz = chart.timezone();
          this.attr({
            y: function(d) {
              var next = moment(d).tz(tz).add(1, 'days');
              return yScale(next) - (yScale(next) - yScale(d))/2;
            }
          })
          .text(function(d) { return opts.labelFormat(moment(d).tz(tz)); });
        }
      }
    });
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    return this;
  },
  opts: function(opts) {
    if (!arguments.length) { return this._opts; }
    this._opts = opts;
    return this;
  },
  timezone: function(timezone) {
    if (!arguments.length) { return this._timezone; }
    this._timezone = timezone;
    return this;
  },
  transform: function(data) {
    var timezone = this.timezone();
    return _.filter(data, function(d) {
      var local = moment(d).tz(timezone);
      var hour = local.hour(), year = local.year();
      if ((hour === 0) && (year === 2014)) {
        return true;
      }
      else {
        return false;
      }
    });
  },
  width: function(width) {
    if (!arguments.length) { return this._width; }
    this._width = width;
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
      var defaults = {};
      _.defaults(opts, defaults);

      chart = el.chart('StackedGroups')
        .height(opts.height)
        .opts(opts.opts)
        .timezone(opts.timezone)
        .width(opts.width)
        .yScale(opts.majorScale);

      return this;
    },
    render: function(data) {
      chart.draw(data);

      return this;
    }
  };
};
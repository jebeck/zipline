/** @jsx React.DOM */
var React = require('react');

var d3 = window.d3;
var moment = require('moment-timezone');

var zipline = require('../src/');
var StackedGroups = zipline.components.vertical.StackedGroups;
var Background = zipline.components.vertical.StackedDayBackground;
var BasicFilter = zipline.dataservices.BasicFilter;
var Label = zipline.components.horizontal.Label;

var scales = zipline.util.scales;

var colors = zipline.util.colors;
var convert = zipline.util.rgbtohex;
var intervalColors = {
  start: convert(colors.interval.start),
  end: convert(colors.interval.end)
}; 

var diabetes = require('../diabetes/');
var CBGLine = diabetes.plot.CBGLine;

var bgCategories = {
  low: 65,
  high: 140
};

var oneHourIntervals = function(bounds) {
  return d3.time.hour.utc.range(
      bounds[0],
      d3.time.day.utc.offset(bounds[1], 364)
    );
};

var dayIntervals = function(bounds) {
  return d3.time.hour.utc.range(bounds[0], bounds[1]);
};

var daysInView = 7, bgSize = 1;

module.exports = function(data) {
  var dataService = new BasicFilter(data);
  var now = moment(), timezone = 'US/Pacific';
  return {
    opts: {
      scroll: 'vertical',
      timespan: {
        initial: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).startOf('year').add(daysInView, 'days').toDate()
        ],
        total: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).endOf('year').toDate()
        ]
      },
      location: {
        bounds: [
          moment(now).tz(timezone).startOf('year').toDate(),
          moment(now).tz(timezone).startOf('year').add(daysInView, 'days').toDate()
        ]
      }
    },
    slices: [{
      id: 'StackedDays',
      background: StackedGroups,
      data: oneHourIntervals,
      once: true,
      opts: {
        embeddedChart: {
          id: function(day) { return 'Background-=-' + day; },
          background: Background,
          data: dayIntervals,
          opts: {
            gutter: 2,
            fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
          },
          plot: [{
            chart: CBGLine,
            data: function(bounds) {
              return dataService.filter([
                d3.time.day.utc.offset(bounds[0], -1).toISOString(),
                d3.time.day.utc.offset(bounds[1], 1).toISOString()
              ]);
            },
            id: function(day) { return 'CBGLine-=-' + day; },
            opts: {
              bgCategories: bgCategories,
              r: bgSize
            }
          }]
        },
        daysInView: daysInView,
        labelFormat: function(d) { return moment(d).format('ddd, MMM Do'); },
        labelGutter: 120
      },
      weight: 1
    }]
  };
};
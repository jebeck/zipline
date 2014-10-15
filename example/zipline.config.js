/** @jsx React.DOM */
var React = require('react');

var d3 = window.d3;
var moment = require('moment-timezone');

var zipline = require('../src/');
var Background = zipline.components.horizontal.Background;
var BasicFilter = zipline.dataservices.BasicFilter;
var Label = zipline.components.horizontal.Label;
var TimeLabels = zipline.components.horizontal.TimeLabels;

var scales = zipline.util.scales;

var colors = zipline.util.colors;
var convert = zipline.util.rgbtohex;
var intervalColors = {
  start: convert(colors.interval.start),
  end: convert(colors.interval.end)
};

var diabetes = require('../diabetes/');
var CBG = diabetes.plot.CBG;

var oneHourIntervals = function(bounds) {
  return d3.time.hour.utc.range(
      d3.time.day.utc.offset(bounds[0], -1),
      d3.time.day.utc.offset(bounds[1], 1)
    );
};

var bgCategories = {
  low: 65,
  high: 140
};

module.exports = function(data) {
  var dataService = new BasicFilter(data);
  return {
    initialTimespan: function(datetime, timezone) {
      return [
        moment(datetime).tz(timezone).toDate(),
        moment(datetime).tz(timezone).add(1, 'days').toDate()
      ];
    },
    slices: [{
      id: 'TimeLabels',
      chart: Background,
      data: oneHourIntervals,
      extension: 'TimeLabels',
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end),
        shiftRight: 10
      },
      weight: 0.25
    }, {
      id: 'Activity',
      chart: Background,
      data: oneHourIntervals,
      label: {
        component: Label,
        text: 'Activity Data'
      },
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
      },
      weight: 2
    }, {
      id: 'Diabetes',
      chart: Background,
      data: oneHourIntervals,
      label: {
        component: Label,
        text: 'Diabetes Data'
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          return dataService.filter([
            d3.time.day.utc.offset(bounds[0], -1).toISOString(),
            d3.time.day.utc.offset(bounds[1], 1).toISOString()
          ]);
        },
        id: 'CBG',
        opts: {
          bgCategories: bgCategories,
          r: 3
        }
      }],
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
      },
      weight: 3
    }]
  };
};
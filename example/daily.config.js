/** @jsx React.DOM */
var React = require('react');

var d3 = window.d3;

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
var BGBackground = diabetes.plot.BGBackground;
var CBG = diabetes.plot.CBGCircleReuse;
var SMBG = diabetes.plot.SMBGCircleReuse;

var bgColors = diabetes.util.colors.bg;
var bgFillColor = convert(bgColors.fill);
var bgIntervalColors = {
  low: {
    start: convert(bgColors.low.basic),
    end: convert(bgColors.low.lighter)
  },
  target: {
    start: convert(bgColors.target.basic),
    end: convert(bgColors.target.lighter)
  },
  high: {
    start: convert(bgColors.high.basic),
    end: convert(bgColors.high.lighter)
  }
};
var bgSizes = {
  cbg: 2.5,
  smbg: 8
};

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
  var grouped = _.groupBy(data, function(d) { return d.type; });
  var dataServices = {};
  var types = Object.keys(grouped);
  for (var i = 0; i < types.length; ++i) {
    var type = types[i];
    dataServices[type] = new BasicFilter(grouped[type]);
  }
  return {
    slices: [{
      id: 'Activity',
      background: Background,
      data: oneHourIntervals,
      label: {
        component: Label,
        text: 'Activity'
      },
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
      },
      weight: 2
    }, {
      id: 'BG',
      background: BGBackground,
      data: oneHourIntervals,
      label: {
        component: Label,
        text: 'Blood Glucose'
      },
      opts: {
        bgCategories: bgCategories,
        fillScales: {
          low: scales.hourcolorscale(bgIntervalColors.low.start, bgIntervalColors.low.end),
          target: scales.hourcolorscale(bgIntervalColors.target.start, bgIntervalColors.target.end),
          high: scales.hourcolorscale(bgIntervalColors.high.start, bgIntervalColors.high.end)
        },
        r: bgSizes.cbg
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          return dataServices.cbg.filter([
            d3.time.day.utc.offset(bounds[0], -1).toISOString(),
            d3.time.day.utc.offset(bounds[1], 1).toISOString()
          ]);
        },
        id: 'CBG',
        opts: {
          bgCategories: bgCategories,
          bgFillColor: bgFillColor,
          r: bgSizes.cbg
        }
      }, {
        chart: SMBG,
        data: function(bounds) {
          return dataServices.smbg.filter([
            d3.time.day.utc.offset(bounds[0], -1).toISOString(),
            d3.time.day.utc.offset(bounds[1], 1).toISOString()
          ]);
        },
        id: 'SMBG',
        opts: {
          bgCategories: bgCategories,
          bgFillColor: bgFillColor,
          r: bgSizes.smbg
        }
      }],
      weight: 3
    }]
  };
};
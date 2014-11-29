/** @jsx React.DOM */
var React = require('react');

var d3 = window.d3;
var moment = require('moment-timezone');

var zipline = require('../src/');
var ClipPath = zipline.components.vertical.ClipPath;
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
var CBGCircle = diabetes.plot.CBGCircle;
// var CBGLine = diabetes.plot.CBGLine;
// var CBGMarker = function(selection) {
//   selection.insert('defs', 'g')
//     .append('marker')
//     .attr({
//       id: 'CBG-lineMarker',
//       markerWidth: 2,
//       markerHeight: 2,
//       refX: 1,
//       refY: 1
//     })
//     .append('circle')
//     .attr({
//       cx: 1,
//       cy: 1,
//       r: 1,
//       stroke: 'none',
//       fill: 'white'
//     });
// };
var SMBGCircle = diabetes.plot.SMBGCircle;
var bgColors = diabetes.util.colors.bg;
var bgFillColor = convert(bgColors.fill);
var bgSizes = {
  cbg: 2.5,
  smbg: 6
};

var bgCategories = {
  low: 65,
  high: 140
};

var oneHourIntervals = function(bounds) {
  var beginning = d3.time.year.utc.floor(bounds[0]);
  return d3.time.hour.utc.range(
      d3.time.day.utc.offset(beginning, -1),
      d3.time.day.utc.offset(d3.time.day.utc.offset(beginning, 1), 365)
    );
};

var dayIntervals = function(bounds) {
  return d3.time.hour.utc.range(bounds[0], bounds[1]);
};

var daysInView = 7, bgSize = 1;

module.exports = function(data) {
  var grouped = _.groupBy(data, function(d) { return d.type; });
  var dataServices = {};
  var types = Object.keys(grouped);
  for (var i = 0; i < types.length; ++i) {
    var type = types[i];
    dataServices[type] = new BasicFilter(grouped[type]);
  }
  var now = moment(), timezone = 'US/Pacific';
  return {
    opts: {
      label: {
        component: Label,
        text: 'Blood Glucose'
      },
      scroll: 'vertical',
      timespan: {
        first: [
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
            chart: ClipPath,
            data: function() {
              return [];
            },
            id: function(day) { return 'ClipPath-=-' + day; }
          },{
            chart: CBGCircle,
            data: function(bounds) {
              return dataServices.cbg.filter([
                bounds[0],
                bounds[1]
              ]);
            },
            id: function(day) { return 'CBGCircles-=-' + day; },
            opts: {
              bgCategories: bgCategories,
              bgFillColor: bgFillColor,
              r: bgSizes.cbg
            }
          }, {
            chart: SMBGCircle,
            data: function(bounds) {
              return dataServices.smbg.filter([
                bounds[0],
                bounds[1]
              ]);
            },
            id: function(day) { return 'SMBGCircles-=-' + day; },
            opts: {
              bgCategories: bgCategories,
              bgFillColor: bgFillColor,
              r: bgSizes.smbg
            }
          }]
        },
        daysInView: daysInView,
        labelFormat: function(d) { return moment(d).format('ddd, MMM Do'); },
        labelGutter: 120,
        // marker: CBGMarker
      },
      weight: 1
    }]
  };
};
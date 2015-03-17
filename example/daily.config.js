/** @jsx React.DOM */
var React = require('react');

var d3 = window.d3;

var zipline = require('../src/');
var Background = zipline.components.horizontal.Background;
var Label = zipline.components.horizontal.Label;

var scales = zipline.util.scales;

var colors = zipline.util.colors;
var convert = zipline.util.rgbtohex;
var intervalColors = {
  start: convert(colors.interval.start),
  end: convert(colors.interval.end)
}; 

var activity = require('../activity/');
var Moves = activity.plot.MovesDailyStoryline;

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

var bgCategories = {
  low: 65,
  high: 140,
  units: 'mg/dL'
};

module.exports = {
  slices: [{
    id: 'Activity',
    background: Background,
    backgroundData: 'offsetInterval',
    label: {
      component: Label,
      text: 'Activity'
    },
    drawOpts: {
      fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
    },
    plots: [{
      chart: Moves,
      id: 'Moves',
      type: 'activity',
      drawOpts: {
        pad: {
          top: 10,
          bottom: 10
        }
      }
    }],
    weight: 2
  }, {
    id: 'BG',
    background: BGBackground,
    backgroundData: 'offsetInterval',
    label: {
      component: Label,
      text: 'Blood Glucose'
    },
    drawOpts: {
      bgCategories: bgCategories,
      fillScales: {
        low: scales.hourcolorscale(bgIntervalColors.low.start, bgIntervalColors.low.end),
        target: scales.hourcolorscale(bgIntervalColors.target.start, bgIntervalColors.target.end),
        high: scales.hourcolorscale(bgIntervalColors.high.start, bgIntervalColors.high.end)
      },
      scaleR: bgSizes.smbg
    },
    plots: [{
      chart: CBG,
      id: 'CBG',
      type: 'cbg',
      drawOpts: {
        bgCategories: bgCategories,
        bgFillColor: bgFillColor,
        r: bgSizes.cbg,
        scaleR: bgSizes.smbg
      }
    }, {
      chart: SMBG,
      id: 'SMBG',
      type: 'smbg',
      drawOpts: {
        bgCategories: bgCategories,
        bgFillColor: bgFillColor,
        r: bgSizes.smbg,
        scaleR: bgSizes.smbg
      }
    }],
    weight: 3
  }]
};
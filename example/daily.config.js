var common = require('./common.config');

var zipline = require('../src/');
var Background = zipline.components.horizontal.Background;
var Label = zipline.components.horizontal.Label;

var scales = zipline.util.scales;

var intervalColors = common.intervalColors;

var activity = require('../activity/');
var Moves = activity.plot.MovesDailyStoryline;

var diabetes = require('../diabetes/');
var BGBackground = diabetes.plot.BGBackground;
var CBG = diabetes.plot.CBGCircleReuse;
var SMBG = diabetes.plot.SMBGCircleReuse;

var bgCategories = common.bgCategories;
var bgIntervalColors = common.bgIntervalColors;
var bgSizes = {
  cbg: 2.5,
  smbg: 8
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
      bgCategories: common.bgCategories,
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
        bgCategories: common.bgCategories,
        r: bgSizes.cbg,
        scaleR: bgSizes.smbg
      }
    }, {
      chart: SMBG,
      id: 'SMBG',
      type: 'smbg',
      drawOpts: {
        bgCategories: common.bgCategories,
        r: bgSizes.smbg,
        scaleR: bgSizes.smbg
      }
    }],
    weight: 3
  }]
};
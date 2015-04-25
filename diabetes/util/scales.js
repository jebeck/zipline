var d3 = window.d3;

var zipline = require('../../src/');
var convert = zipline.util.rgbtohex;

var colors = require('./colors');

var GLUCOSE_CONVERSION = 18.01559;

module.exports = {
  bg: function(height, pad) {
    return d3.scale.linear()
      .domain([19/GLUCOSE_CONVERSION, 401/GLUCOSE_CONVERSION])
      .range([height - pad, pad])
      .clamp(true);
  },
  bgFill: function(bgCategories) {
    var categoryColors = {
      low: convert(colors.bg.low.fill),
      target: convert(colors.bg.target.fill),
      high: convert(colors.bg.high.fill)
    };
    return d3.scale.threshold()
      .domain([bgCategories.low/GLUCOSE_CONVERSION, bgCategories.high/GLUCOSE_CONVERSION])
      .range([categoryColors.low, categoryColors.target, categoryColors.high]);
  }
};
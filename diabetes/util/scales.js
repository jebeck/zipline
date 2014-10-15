var d3 = window.d3;

var zipline = require('../../src/');
var convert = zipline.util.rgbtohex;

var colors = require('./colors');

module.exports = {
  bg: function(height, pad) {
    return d3.scale.linear()
      .domain([0, 401])
      .range([height - pad, pad]);
  },
  bgFill: function(bgCategories) {
    var categoryColors = {
      low: convert(colors.bg.low),
      target: convert(colors.bg.target),
      high: convert(colors.bg.high)
    };
    return d3.scale.threshold()
      .domain([bgCategories.low, bgCategories.high])
      .range([categoryColors.low, categoryColors.target, categoryColors.high]);
  }
};
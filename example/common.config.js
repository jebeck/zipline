var zipline = require('../src/');
var colors = zipline.util.colors;
var convert = zipline.util.rgbtohex;

var diabetes = require('../diabetes/');
var bgColors = diabetes.util.colors.bg;

module.exports = {
	bgCategories: {
	  low: 65,
	  high: 140,
	  units: 'mg/dL'
	},
	bgIntervalColors: {
	  low: {
	    start: convert(bgColors.low.start),
	    end: convert(bgColors.low.end)
	  },
	  target: {
	    start: convert(bgColors.target.start),
	    end: convert(bgColors.target.end)
	  },
	  high: {
	    start: convert(bgColors.high.start),
	    end: convert(bgColors.high.end)
	  }
	},
	intervalColors: {
	  start: convert(colors.interval.start),
	  end: convert(colors.interval.end)
	}
};
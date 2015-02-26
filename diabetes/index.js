require('./less/axes.less');
require('./less/plot.less');

var diabetes = {
  plot: {
    axes: {
      BGAxis: require('./plot/axes/BGAxis')
    },
    BGBackground: require('./plot/BGBackground'),
    CBGCircleReuse: require('./plot/CBGCircleReuse'),
    SMBGCircleReuse: require('./plot/SMBGCircleReuse')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = diabetes;
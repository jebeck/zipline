require('./less/axes.less');
require('./less/plot.less');

var diabetes = {
  plot: {
    axes: {
      BGAxis: require('./plot/axes/BGAxis')
    },
    BGBackground: require('./plot/BGBackground'),
    CBGCircleReuse: require('./plot/CBGCircleReuse'),
    CBGCircle: require('./plot/CBGCircle'),
    CBGLine: require('./plot/CBGLine'),
    SMBGCircle: require('./plot/SMBGCircle'),
    SMBGCircleReuse: require('./plot/SMBGCircleReuse')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = diabetes;
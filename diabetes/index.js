require('./less/plot.less');

var diabetes = {
  plot: {
    BGBackground: require('./plot/BGBackground'),
    CBGCircleReuse: require('./plot/CBGCircleReuse'),
    CBGCircle: require('./plot/CBGCircle'),
    CBGLine: require('./plot/CBGLine'),
    SMBGCircle: require('./plot/SMBGCircle')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = diabetes;
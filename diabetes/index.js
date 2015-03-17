require('./less/plot.less');

var diabetes = {
  plot: {
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
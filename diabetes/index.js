var diabetes = {
  plot: {
    BGBackground: require('./plot/BGBackground'),
    CBGCircleReuse: require('./plot/CBGCircleReuse'),
    CBGCircle: require('./plot/CBGCircle'),
    CBGLine: require('./plot/CBGLine')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = diabetes;
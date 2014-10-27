var diabetes = {
  plot: {
    BGBackground: require('./plot/BGBackground'),
    CBG: require('./plot/CBG'),
    CBGLine: require('./plot/CBGLine')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = diabetes;
require('./less/plot.less');

var activity = {
  plot: {
    MovesDailyStoryline: require('./plot/MovesDailyStoryline')
  },
  util: {
    colors: require('./util/colors'),
    scales: require('./util/scales')
  }
};

module.exports = activity;
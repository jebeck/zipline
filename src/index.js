require('script!d3/d3.min.js');
require('script!d3.chart/d3.chart.js');

require('./less/Zip.less');

var zipline = {
  components: {
    horizontal: {
      Background: require('./components/horizontal/Background')
    },
    vertical: {}
  },
  util: {
    colors: require('./util/colors'),
    rgbtohex: require('./util/rgbtohex'),
    reuse: require('./util/reusenodes'),
    scales: require('./util/scales')
  },
  Zipline: require('./Zipline')
};

module.exports = zipline;
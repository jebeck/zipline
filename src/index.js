require('script!d3/d3.min.js');
require('script!d3.chart/d3.chart.js');

require('./less/zipline.less');

var zipline = {
  actions: {
    ZipActions: require('./actions/ZipActions')
  },
  components: {
    horizontal: {
      Background: require('./components/horizontal/Background'),
      Label: require('./components/horizontal/Label')
    },
    page: {
      Dashboard: require('./components/page/Dashboard'),
      Details: require('./components/page/Details'),
      Picker: require('./components/page/Picker'),
      Timeline: require('./components/page/Timeline')
    }
  },
  constants: {
    ZipConstants: require('./constants/ZipConstants')
  },
  dataservices: {
    DateTriggerFilter: require('./dataservices/DateTriggerFilter')
  },
  dispatcher: {
    ZipDispatcher: require('./dispatcher/ZipDispatcher')
  },
  stores: {
    ConfigStore: require('./stores/ConfigStore'),
    DataStore: require('./stores/DataStore')
  },
  util: {
    colors: require('./util/colors'),
    rgbtohex: require('./util/rgbtohex'),
    reuse: require('./util/reusenodes'),
    scales: require('./util/scales')
  },
  Zipline: require('./Zipline'),
  Zippage: require('./Zippage')
};

module.exports = zipline;
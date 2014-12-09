require('script!d3/d3.min.js');
require('script!d3.chart/d3.chart.js');

require('./less/zipline.less');

var zipline = {
  components: {
    horizontal: {
      Background: require('./components/horizontal/Background'),
      Label: require('./components/horizontal/Label'),
      TimeLabels: require('./components/horizontal/TimeLabels')
    },
    page: {
      Dashboard: require('./components/page/Dashboard'),
      Details: require('./components/page/Details'),
      Picker: require('./components/page/Picker'),
      Timeline: require('./components/page/Timeline')
    },
    vertical: {
      ClipPath: require('./components/vertical/ClipPath'),
      StackedDayBackground: require('./components/vertical/StackedDayBackground'),
      StackedGroups: require('./components/vertical/StackedGroups')
    }
  },
  dataservices: {
    BasicFilter: require('./dataservices/BasicFilter'),
    DateTriggerFilter: require('./dataservices/DateTriggerFilter'),
    NoFilter: require('./dataservices/NoFilter')
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
/** @jsx React.DOM */
var React = require('react');

var crossfilter = require('crossfilter');
var d3 = require('d3');
var moment = require('moment-timezone');

var zipline = require('../src/');
var Chart = zipline.Zipline;
var Background = zipline.components.horizontal.Background;
var scales = zipline.util.scales;

var diabetes = require('../diabetes/');
var CBG = diabetes.plot.CBG;

var App = React.createClass({
  getInitialState: function() {
    return {loading: true};
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    d3.json('../data/2014.json', this.createCrossData);
  },

  createCrossData: function(err, data) {
    if (err) {
      throw new Error('Could not fetch data!');
    }
    var crossData = crossfilter(data);
    var dataByType = crossData.dimension(function(d) {
      return d.type;
    });
    var dataByDatetime = crossData.dimension(function(d) {
      return d.trueUtcTime.slice(0,10);
    });
    var cbgData = dataByType.filter('cbg').top(Infinity);

    this.setState({
      loading: false,
      dataByDatetime: dataByDatetime,
      dataByType: dataByType
    });
    this.createZipline();
  },

  createZipline: function() {
    var dataByType = this.state.dataByType;
    var dataByDatetime = this.state.dataByDatetime;
    this.chart = Chart.create(this.refs.chart.getDOMNode(), 'US/Pacific', {});
    this.chart.draw([{
      chart: Background,
      data: function(bounds) {
        return d3.time.hour.utc.range(
          moment(bounds[0]).utc().subtract(1, 'days').toDate(),
          moment(bounds[1]).utc().add(1, 'days').toDate(),
          1);
      },
      id: 'Background/top',
      opts: {
        fillScale: scales.hourcolorscale('#872928', '#BC373F')
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          dataByType.filter('cbg');
          return dataByDatetime.filter([
            moment(bounds[0]).utc().subtract(1, 'days').toISOString(),
            moment(bounds[1]).utc().add(1, 'days').toISOString()
          ]).top(Infinity);
        },
        id: 'CBG/top',
        opts: {
          r: 3,
          fill: 'white'
        }
      }]
    }, {
      chart: Background,
      data: function(bounds) {
        return d3.time.hour.utc.range(
          moment(bounds[0]).utc().subtract(1, 'days').toDate(),
          moment(bounds[1]).utc().add(1, 'days').toDate(),
          1);
      },
      id: 'Background/bottom',
      opts: {
        fillScale: scales.hourcolorscale('#872928', '#BC373F')
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          dataByType.filter('cbg');
          return dataByDatetime.filter([
            moment(bounds[0]).utc().subtract(1, 'days').toISOString(),
            moment(bounds[1]).utc().add(1, 'days').toISOString()
          ]).top(Infinity);
        },
        id: 'CBG/bottom',
        opts: {
          r: 3,
          fill: 'white'
        }
      }]
    }]);
  },

  render: function() {
    /* jshint ignore:start */
    return (
      <div className="App">
        <div className="App-chart Zipline" ref="chart"></div>
      </div>
      );
    /* jshint ignore:end */
  }
});

module.exports = App;
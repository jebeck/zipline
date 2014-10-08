/** @jsx React.DOM */
var React = require('react');

var crossfilter = require('crossfilter');
var d3 = require('d3');

var zipline = require('../src/');
var Chart = zipline.Zipline;
var Background = zipline.components.horizontal.Background;
var scales = zipline.util.scales;
var colors = zipline.util.colors;
var convert = zipline.util.rgbtohex;
var intervalColors = {
  start: convert(colors.interval.start),
  end: convert(colors.interval.end)
};

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
            d3.time.day.utc.offset(bounds[0], -1),
            d3.time.day.utc.offset(bounds[1], 1)
          );
      },
      id: 'Background/top',
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          dataByType.filter('cbg');
          return dataByDatetime.filter([
            d3.time.day.utc.offset(bounds[0], -1).toISOString(),
            d3.time.day.utc.offset(bounds[1], 1).toISOString()
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
            d3.time.day.utc.offset(bounds[0], -1),
            d3.time.day.utc.offset(bounds[1], 1)
          );
      },
      id: 'Background/bottom',
      opts: {
        fillScale: scales.hourcolorscale(intervalColors.start, intervalColors.end)
      },
      plot: [{
        chart: CBG,
        data: function(bounds) {
          dataByType.filter('cbg');
          return dataByDatetime.filter([
            d3.time.day.utc.offset(bounds[0], -1).toISOString(),
            d3.time.day.utc.offset(bounds[1], 1).toISOString()
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
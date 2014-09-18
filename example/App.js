/** @jsx React.DOM */
var React = require('react');

var moment = require('moment-timezone');

var zipline = require('../src/');
var Chart = zipline.Zipline;
var Background = zipline.components.Background;
var scales = zipline.util.scales;

var App = React.createClass({
  getInitialState: function() {
    return {loading: false};
  },

  componentDidMount: function() {
    this.createZipline();
  },

  createZipline: function() {
    this.chart = Chart.create(this.refs.chart.getDOMNode(), 'US/Central', {});
    this.chart.draw([{
      chart: Background,
      data: function(bounds) {
        return d3.time.hour.utc.range(
          moment(bounds[0]).utc().subtract(1, 'days').toDate(),
          moment(bounds[1]).utc().add(1, 'days').toDate(),
          1);
      },
      id: 'Background',
      opts: {
        fillScale: scales.hourcolorscale('#872928', '#BC373F')
      }
    }, {
      chart: Background,
      data: function(bounds) {
        return d3.time.hour.utc.range(
          moment(bounds[0]).utc().subtract(1, 'days').toDate(),
          moment(bounds[1]).utc().add(1, 'days').toDate(),
          1);
      },
      id: 'Background',
      opts: {
        fillScale: scales.hourcolorscale('#872928', '#BC373F')
      }
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
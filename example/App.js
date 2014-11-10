/** @jsx React.DOM */
var React = require('react');

var d3 = require('d3');

var zipline = require('../src');
var Zippage = zipline.Zippage;
var BasicFilter = zipline.dataservices.BasicFilter;

var dailyConfig = require('./daily.config');
var weeklyConfig = require('./weekly.config');

var App = React.createClass({
  getInitialState: function() {
    return {
      chartType: 'daily',
      dataUrl: '../data/2014.json',
      loading: true
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    d3.json(this.state.dataUrl, function(err, data) {
      if (err) {
        throw new Error('Could not fetch data!');
      }
      if (this.isMounted()) {
        this.setState({
          data: data,
          loading: false
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.state.loading) {
      return this.renderNoData();
    }
    return this.renderData();
  },

  renderData: function() {
    /* jshint ignore:start */
    return (
      <div className="App">
        <div className="App-chrome" ref="chrome" />
        <div className="App-chart" ref="chart">
            <Zippage data={this.state.data} zipConfig={weeklyConfig(this.state.data)} />
        </div>
      </div>
      );
    /* jshint ignore:end */
  },

  renderNoData: function() {
    /* jshint ignore:start */
    return (
      <div className="App">
        <div className="App-chrome" ref="chrome" />
        <div className="App-loadingMessage" ref="loading">
            <p>Loading data...</p>
        </div>
      </div>
      );
    /* jshint ignore:end */
  }
});

module.exports = App;
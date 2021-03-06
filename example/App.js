/** @jsx React.DOM */
var React = require('react');

var bows = require('bows');
var d3 = require('d3');

var zipline = require('../src');
var Zippage = zipline.Zippage;

var dailyConfig = require('./daily.config');

var debug = bows('App');

var App = React.createClass({
  getInitialState: function() {
    return {
      chartType: 'daily',
      dataUrl: 'data/2014.json',
      loading: true
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    console.time('Loading Data');
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
    console.timeEnd('Loading Data');
    return this.renderData();
  },

  renderData: function() {
    return (
      <div className="App">
        <div className="App-chrome" ref="chrome" />
        <div className="App-chart" ref="chart">
            <Zippage
              allData={this.state.data}
              baseConfig={dailyConfig} />
        </div>
      </div>
      );
  },

  renderNoData: function() {
    return (
      <div className="App">
        <div className="App-chrome" ref="chrome" />
        <div className="App-loadingMessage" ref="loading">
            <p>Loading data...</p>
        </div>
      </div>
      );
  }
});

module.exports = App;
/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var d3 = require('d3');

var ZipActions = require('./actions/ZipActions');
var ConfigStore = require('./stores/ConfigStore');
var DataStore = require('./stores/DataStore');

var Dashboard = require('./components/page/Dashboard');
var Details = require('./components/page/Details');
var Picker = require('./components/page/Picker');
var Timeline = require('./components/page/Timeline');

var Zippage = React.createClass({
  propTypes: {
    allData: React.PropTypes.array.isRequired,
    baseConfig: React.PropTypes.object.isRequired,
    details: React.PropTypes.bool.isRequired,
    dashboard: React.PropTypes.bool.isRequired,
    picker: React.PropTypes.bool.isRequired
  },
  getDefaultProps: function() {
    return {
      details: true,
      dashboard: true,
      picker: true
    };
  },
  getInitialState: function() {
    return {
      createConfig: null,
      drawConfig: null,
      dataBySlice: null,
      data: null,
      datetimeLocation: null,
      focus: null,
      initialViewBounds: null
    };
  },
  componentDidMount: function() {
    ConfigStore.addChangeListener(this._onConfigChange);
    DataStore.addChangeListener(this._onDataChange);
    this.initialize();
  },
  componentWillUnmount: function() {
    ConfigStore.removeChangeListener(this._onConfigChange);
    DataStore.removeChangeListener(this._onDataChange);
  },
  render: function() {
    var details = this.props.details ? this.renderDetails() : null;
    var timeline = this.renderTimeline();

    var timelineRowClass = cx({
      'Zippage-row': true,
      'Zippage-row--alone': !this.props.dashboard,
      'Zippage-row--top': this.props.dashboard
    });

    var bottomRow = this.renderBottomRow();

    /* jshint ignore:start */
    return (
      <div className="Zippage" ref="zippage">
        <div className={timelineRowClass}>
          {details}
          {timeline}
        </div>
        {bottomRow}
      </div>
    );
    /* jshint ignore:end */
  },
  renderBottomRow: function() {
    if (!this.props.dashboard) {
      return null;
    }

    var picker = this.renderPicker();
    var dashboard = this.props.dashboard ? this.renderDashboard() : null;

    var bottomRowClass = cx({
      'Zippage-row': true,
      'Zippage-row--bottom': this.props.dashboard
    });
    /* jshint ignore:start */
    return (
      <div className={bottomRowClass}>
        {picker}
        {dashboard}
      </div>
    );
    /* jshint ignore:end */
  },
  renderDashboard: function() {
    /* jshint ignore:start */
    return (
      <Dashboard alone={this.isAlone()} />
    );
    /* jshint ignore:end */
  },
  renderDetails: function() {
    /* jshint ignore:start */
    return (
      <Details />
    );
    /* jshint ignore:end */
  },
  renderPicker: function() {
    // rendering a picker without a dashboard is not supported
    if (!this.props.dashboard) {
      return null;
    }
    /* jshint ignore:start */
    return (
      <Picker
        empty={!this.props.picker} />
    );
    /* jshint ignore:end */
  },
  renderTimeline: function() {
    if (!this.readyToDraw()) {
      return null;
    }
    /* jshint ignore:start */
    return (
      <Timeline
        dashboard={this.props.dashboard}
        details={this.props.details}
        createConfig={this.state.createConfig}
        drawConfig={this.state.drawConfig}
        dataBySlice={this.state.dataBySlice}
        edgeLocation={this.state.initialViewBounds[0]} />
    );
    /* jshint ignore:end */
  },
  getPlotTypes: function() {
    var slices = this.props.baseConfig.slices;
    var plotTypes = [];
    _.each(slices, function(slice) {
      var plots = slice.plots;
      _.each(plots, function(plot) {
        if (plot.type) {
          plotTypes.push(plot.type);
        }
      });
    });
    return plotTypes;
  },
  isAlone: function() {
    return !this.props.details;
  },
  initialize: function() {
    ZipActions.initializeData(this.props.allData, this.getPlotTypes());
    ZipActions.initializeConfig(this.props.baseConfig);
  },
  readyToDraw: function() {
    return this.state.createConfig !== null &&
      this.state.drawConfig !== null &&
      this.state.dataBySlice !== null;
  },
  _onConfigChange: function() {
    this.setState({
      createConfig: ConfigStore.getCreateConfig(),
      drawConfig: ConfigStore.getDrawConfig(),
      dataBySlice: ConfigStore.getDataBySlice()
    });
  },
  _onDataChange: function() {
    this.setState({
      data: DataStore.getCurrentData(),
      datetimeLocation: DataStore.getCenter(),
      focus: DataStore.getFocusedData(),
      initialViewBounds: DataStore.getInitialViewBounds()
    });
  }
});

module.exports = Zippage;
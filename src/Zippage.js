/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var d3 = require('d3');
var moment = require('moment-timezone');

var Dashboard = require('./components/page/Dashboard');
var Details = require('./components/page/Details');
var Picker = require('./components/page/Picker');
var Timeline = require('./components/page/Timeline');

var Zippage = React.createClass({
  getDefaultProps: function() {
    return {
      dateFormat: 'dddd, MMMM Do',
      details: true,
      dashboard: true,
      monthFormat: 'MMMM YYYY',
      picker: true,
      timezone: 'US/Pacific'
    };
  },
  getInitialState: function() {
    return {
      datetimeLocation: null
    };
  },
  propTypes: {
    data: React.PropTypes.array.isRequired,
    dateFormat: React.PropTypes.string.isRequired,
    details: React.PropTypes.bool.isRequired,
    dashboard: React.PropTypes.bool.isRequired,
    monthFormat: React.PropTypes.string.isRequired,
    picker: React.PropTypes.bool.isRequired,
    timezone: React.PropTypes.string.isRequired,
    zipConfig: React.PropTypes.object.isRequired
  },
  handleNavigation: function(datetimeStr) {
    this.setState({
      datetimeLocation: datetimeStr
    });
  },
  render: function() {
    var details = this.props.details ? this.renderDetails() : null;
    var timeline = this.renderTimeline();
    var picker = this.renderPicker();
    var dashboard = this.props.dashboard ? this.renderDashboard() : null;

    var timelineRowClass = cx({
      'Zippage-row': true,
      'Zippage-row--alone': !this.props.dashboard,
      'Zippage-row--top': this.props.dashboard
    });

    var bottomRowClass = cx({
      'Zippage-row': true,
      'Zippage-row--bottom': this.props.dashboard
    });

    /* jshint ignore:start */
    return (
      <div className="Zippage" ref="zippage">
        <div className={timelineRowClass}>
          {details}
          {timeline}
        </div>
        <div className={bottomRowClass}>
          {picker}
          {dashboard}
        </div>
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
    var date = moment(this.props.datetimeLocation)
      .tz(this.props.timezone)
      .format(this.props.dateFormat);

    /* jshint ignore:start */
    return (
      <Details date={date} />
    );
    /* jshint ignore:end */
  },
  renderPicker: function() {
    var monthYear = moment(this.props.datetimeLocation)
      .tz(this.props.timezone)
      .format(this.props.monthFormat);

    // rendering a picker without a dashboard is not supported
    if (!this.props.dashboard) {
      return null;
    }
    /* jshint ignore:start */
    return (
      <Picker
        empty={!this.props.picker}
        monthYear={this.props.picker ? monthYear : ''} />
    );
    /* jshint ignore:end */
  },
  renderTimeline: function() {
    /* jshint ignore:start */
    return (
      <Timeline
        dashboard={this.props.dashboard}
        details={this.props.details}
        timezone={this.props.timezone}
        zipConfig={this.props.zipConfig}
        onNavigation={this.handleNavigation} />
    );
    /* jshint ignore:end */
  },
  isAlone: function() {
    return !this.props.details;
  }
});

module.exports = Zippage;
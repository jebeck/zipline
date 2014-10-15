/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var Dashboard = React.createClass({
  propTypes: {
    alone: React.PropTypes.bool.isRequired
  },
  render: function() {
    var dashboardClass = cx({
      'FlexItem': true,
      'FlexItem-dashboard': true,
      'FlexItem-dashboard--alone': this.props.alone
    });
    /* jshint ignore:start */
    return (
      <div className={dashboardClass} ref="dashboard" />
    );
    /* jshint ignore:end */
  }
});

module.exports = Dashboard;
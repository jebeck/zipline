/** @jsx React.DOM */
var React = require('react/addons');

var cx = require('classnames');

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
    return (
      <div className={dashboardClass} ref="dashboard" />
    );
  }
});

module.exports = Dashboard;
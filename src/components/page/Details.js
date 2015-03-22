/** @jsx React.DOM */
var React = require('react');

var _ = require('lodash');
var cx = require('classnames');
var moment = require('moment-timezone');

var Details = React.createClass({
  propTypes: {
    alone: React.PropTypes.bool.isRequired,
    viewBounds: React.PropTypes.object.isRequired,
    viewBoundsMask: React.PropTypes.string.isRequired
  },
  render: function() {
    var detailsClass = cx({
      'Details': true,
      'Details--regular': !this.props.alone,
      'Details--large': this.props.alone,
      'FlexItem': true,
      'FlexItem-details': true
    });
    var viewBounds = this.renderViewBounds();
    return (
      <div className={detailsClass} ref="details">
        <div className='Details-inner'>
          <div className='Details-label'><h2>Details</h2></div>
          {viewBounds}
        </div>
      </div>
    );
  },
  renderViewBounds: function() {
    if (_.isEmpty(this.props.viewBounds)) {
      return null;
    }
    var left = this.props.viewBounds.leftEdge;
    var right = this.props.viewBounds.rightEdge;
    var leftTzAbbr = moment.tz.zone(left.timezone).abbr(left.datetime.valueOf());
    var rightTzAbbr = moment.tz.zone(right.timezone).abbr(right.datetime.valueOf());
    return (
      <div>
        <h3>Currently in View</h3>
        <p className='ViewBounds ViewBounds--left'>
          <span className='Span--secondary'>from  </span>
          {moment(left.datetime).tz(left.timezone).format(this.props.viewBoundsMask) + ' ' + leftTzAbbr}
        </p>
        <p className='ViewBounds ViewBounds--right'>
          {moment(right.datetime).tz(right.timezone).format(this.props.viewBoundsMask) + ' ' + rightTzAbbr}
          <span className='Span--secondary'>  to</span>
        </p>
      </div>
    );
  }
});

module.exports = Details;
/** @jsx React.DOM */
var React = require('react');

var moment = require('moment-timezone');

var DetailsDates = React.createClass({
  propTypes: {
    viewBounds: React.PropTypes.object.isRequired,
    viewBoundsMask: React.PropTypes.string.isRequired
  },
  render: function() {
    var left = this.props.viewBounds.leftEdge;
    var right = this.props.viewBounds.rightEdge;
    var leftTzAbbr = moment.tz.zone(left.timezone).abbr(left.datetime.valueOf());
    var rightTzAbbr = moment.tz.zone(right.timezone).abbr(right.datetime.valueOf());
    
    return (
      <div>
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

module.exports = DetailsDates;
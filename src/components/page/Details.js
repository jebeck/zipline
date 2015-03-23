/** @jsx React.DOM */
var React = require('react');

var _ = require('lodash');
var cx = require('classnames');

var Collapsible = require('./Details-Collapsible');
var Dates = require('./Details-Dates');

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
    var dates = (
      <Dates viewBounds={this.props.viewBounds}
        viewBoundsMask={this.props.viewBoundsMask} />
    );
    return (
      <Collapsible header={'Currently in View'}
        toCollapse={dates} />
    );
  }
});

module.exports = Details;
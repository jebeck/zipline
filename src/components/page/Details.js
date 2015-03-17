/** @jsx React.DOM */
var React = require('react');

var Details = React.createClass({
  propTypes: {},
  render: function() {
    var detailsClass = 'FlexItem FlexItem-details';
    return (
      <div className={detailsClass} ref="details" />
    );
  }
});

module.exports = Details;
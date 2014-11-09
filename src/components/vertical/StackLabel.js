/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var StackLabel = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    large: React.PropTypes.bool.isRequired,
    text: React.PropTypes.string.isRequired
  }
});

module.exports = StackLabel;
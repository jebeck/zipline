/** @jsx React.DOM */
var React = require('react');

var Picker = React.createClass({
  propTypes: {
    empty: React.PropTypes.bool.isRequired
  },
  render: function() {
    var pickerClass = 'FlexItem FlexItem-picker';
    if (this.props.empty) {
      /* jshint ignore:start */
      return (
        <div className={pickerClass} />
      );
      /* jshint ignore:end */
    }
    /* jshint ignore:start */
    return (
      <div className={pickerClass} ref="picker" />
    );
    /* jshint ignore:end */
  }
});

module.exports = Picker;
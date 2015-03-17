/** @jsx React.DOM */
var React = require('react');

var Picker = React.createClass({
  propTypes: {
    empty: React.PropTypes.bool.isRequired
  },
  render: function() {
    var pickerClass = 'FlexItem FlexItem-picker';
    if (this.props.empty) {
      return (
        <div className={pickerClass} />
      );
    }
    return (
      <div className={pickerClass} ref="picker" />
    );
  }
});

module.exports = Picker;